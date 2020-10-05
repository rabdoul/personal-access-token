import express = require('express');

import { currentPrincipal } from '../../application/Authentication';
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';
import { activityIdFromReference, activityReferenceFromId } from "./ActivitiesMapping";
import ActivityConfigurationAdapter from './ActivityConfigurationAdapter';

type GetActivitiesQueryResponse = {
    activities: (Activity & { reference: string, eligibleProcess: number[] })[];
    [k: string]: any;
}

type Activity = {
    order: number,
    enabled: boolean
}

const PROCESS_BY_OFFER: Record<string, number> = { MTO: 1, MTC: 2, MTM: 3, OD: 4 };

export class ActivitiesResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/activities', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'production-rules-configuration.query.get', parameters: {} })
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            res.send(ActivitiesResource.toActivities(response.data as GetActivitiesQueryResponse));
        } else {
            res.status(500).send(`Unexpected error when retrieving activities : ${response.data}`);
        }
    }

    static toActivities(response: GetActivitiesQueryResponse): Activity[] {
        const offers = currentPrincipal().authorizations.map(it => it.offer);

        const predicate = offers.includes('OD')
            ? () => true
            : (activity: { eligibleProcess: number[] }) => offers.some(o => activity.eligibleProcess.includes(PROCESS_BY_OFFER[o]));

        return response.activities
            .filter(predicate)
            .map(it => ({ id: activityIdFromReference(it.reference), order: it.order, enabled: it.enabled }));
    }
}

export class ActivityResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/activities/:id', this.get.bind(this))
    }

    async get(req: express.Request, res: express.Response) {
        const activityId = req.params.id
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'production-rules-configuration.query.get', parameters: {} });
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            const config = (response.data!! as any).activities.find((activity: any) => activity.reference === activityReferenceFromId(activityId));
            res.send(new ActivityConfigurationAdapter().toConfig(config));
        } else {
            res.status(500).send(`Unexpected error when retrieving activity ${activityId}: ${response.data}`);
        }
    }

}


