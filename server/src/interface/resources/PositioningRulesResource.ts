import express = require('express');
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

export class PositioningRulesResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/positioning-rules', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'zone-positioning-rules.query.list', parameters: {} });
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            res.send((response.data as { zonePositioningRuleId: string, reference: string }[]).map((it => ({ value: it.zonePositioningRuleId, label: it.reference }))));
        } else {
            res.status(500).send(`Unexpected error when retrieving positioning rules : ${response.data}`);
        }
    }

}