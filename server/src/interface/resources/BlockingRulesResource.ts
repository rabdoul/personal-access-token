import express = require('express');
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

export class BlockingRulesResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/blocking-rules', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'blocking-rule.query.list', parameters: {} });
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            res.send((response.data as { blockingRuleId: string, reference: string, isMotifRule: boolean }[]).map((it => ({ value: it.blockingRuleId, label: it.reference, isMotifRule: it.isMotifRule }))));
        } else {
            res.status(500).send(`Unexpected error when retrieving blocking rules : ${response.data}`);
        }
    }

}