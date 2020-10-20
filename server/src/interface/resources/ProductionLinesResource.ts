import express = require('express');
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

export class ProductionLinesResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/production-lines', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'production-line.query.list', parameters: {} });
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            res.send((response.data as { productionLineId: string, reference: string }[]).map((it => ({ value: it.productionLineId, label: it.reference }))));
        } else {
            res.status(500).send(`Unexpected error when retrieving offloading rules : ${response.data}`);
        }
    }

}