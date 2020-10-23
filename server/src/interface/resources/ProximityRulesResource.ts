import express = require('express');
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

export class ProximityRulesResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/proximity-rules', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'proximity-rules.query.list', parameters: {} });
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            // TODO how to determine if it is a motif rule or not ?
            res.send((response.data as { proximityRulesId: string, name: string }[]).map((it => ({ value: it.proximityRulesId, label: it.name, isMotifRule: false }))));
        } else {
            res.status(500).send(`Unexpected error when retrieving proximity rules : ${response.data}`);
        }
    }

}