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
            res.send((response.data as any[]).map((it => {
                const isMotifRule = it.MaterialProximityRules.some((mpr: any) => mpr.MaterialType < 8);
                return { value: it.proximityRulesId, label: it.name, isMotifRule };
            })));
        } else {
            res.status(500).send(`Unexpected error when retrieving proximity rules : ${response.data}`);
        }
    }

}