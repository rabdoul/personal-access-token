import express = require('express');
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

export class OffloadingRulesResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/offloading-rules', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'offloading-rule.query.list', parameters: {} });
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            res.send((response.data as { offloadingRuleId: string, reference: string }[]).map((it => ({ value: it.offloadingRuleId, label: it.reference }))));
        } else {
            res.status(500).send(`Unexpected error when retrieving offloading rules : ${response.data}`);
        }
    }

}