import express = require('express');
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';
import { activityReferenceFromId } from './ActivitiesMapping';
import ActivityConfigurationAdapter from './ActivityConfigurationAdapter';

export class ValidateMTMProductRuleResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/rules/validate-mtm-product', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'production-rules.query.get', parameters: {} })
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            const parameters = (response.data!! as any).activities["Validate MTM Product"]?.conditionalBlocks[0]?.activityParameters;
            res.send({ stopOnOutOfRangeWarning: parameters?.stopOnOutOfRangeWarning, stopOnIncorrectValueWarning: parameters?.stopOnIncorrectValueWarning });
        } else {
            res.status(500).send(`Unexpected error when retrieving validate MTM product rule : ${response.data}`);
        }
    }
}


export class ValidateMTMProductActivityResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/activities/validate-mtm-product', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'production-rules-configuration.query.get', parameters: {} });
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            const config = (response.data!! as any).activities.find((activity: any) => activity.reference === activityReferenceFromId('validate-mtm-product'));
            res.send(new ActivityConfigurationAdapter().toConfig(config));
        } else {
            res.status(500).send(`Unexpected error when retrieving validate MTM product activity : ${response.data}`);
        }
    }

}

