import express = require('express');
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

export class SequencingRuleResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/rules/setup-sequencing', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'production-rules.query.get', parameters: {} })
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            const parameters = (response.data!! as any).activities["Setup sequencing"]?.conditionalBlocks[0]?.activityParameters;
            res.send({ splitCommandProducts: parameters?.splitList, numberOfProductOrders: parameters?.firstSubListSize });
        } else {
            res.status(500).send(`Unexpected error when retrieving setup sequencing activity : ${response.data}`);
        }
    }

}