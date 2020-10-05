import express = require('express');
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

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