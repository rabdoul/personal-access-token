import express = require('express');

import { currentPrincipal } from '../../application/Authentication';
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';
import { activityIdFromReference, activityReferenceFromId } from "./ActivitiesMapping";
import ActivityConfigurationAdapter from './ActivityConfigurationAdapter';

type GetActivitiesQueryResponse = {
    activities: Activity[];
    [k: string]: any;
}

export type Activity = { order: number, enabled: boolean, reference: string, eligibleProcess: number[], eligibleConditions: any[] }

const PROCESS_BY_OFFER: Record<string, number> = { MTO: 1, MTC: 2, MTM: 3, OD: 4 };

export class ActivitiesResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/activities', this.activities.bind(this))
        this.router.get('/api/activities/:id', this.activityConfiguration.bind(this))
    }

    async activities(_: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const response = await this.retrieveActivities();
            res.send(ActivitiesResource.toActivities(response));
        } catch (error) {
            next(error);
        }
    }

    async activityConfiguration(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const response = await this.retrieveActivities();
            const activity = response.activities.find(activity => activity.reference === activityReferenceFromId(req.params.id));
            if (!activity) throw new Error(`Unknown activity ${req.params.id}`)
            res.send(new ActivityConfigurationAdapter().toConfig(activity));
        } catch (error) {
            next(error);
        }
    }

    private async retrieveActivities(): Promise<GetActivitiesQueryResponse> {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'production-rules-configuration.query.get', parameters: {} });
        if (response.type !== QueryResponseType.QUERY_SUCCESS) {
            throw new Error(`Unexpected error when retrieving activities : ${response.data}`)
        }
        return response.data as GetActivitiesQueryResponse;
    }


    static toActivities(response: GetActivitiesQueryResponse) {
        const offers = currentPrincipal().authorizations.map(it => it.offer);

        const predicate = offers.includes('OD')
            ? () => true
            : (activity: { eligibleProcess: number[] }) => offers.some(o => activity.eligibleProcess.includes(PROCESS_BY_OFFER[o]));

        return response.activities
            .filter(predicate)
            .map(it => ({ id: activityIdFromReference(it.reference), order: it.order, enabled: it.enabled }));
    }
}
