import express = require('express');
import { currentPrincipal } from '../../application/Authentication';
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

export class ProductCategoriesResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/product-categories', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const locale = currentPrincipal().userLocale?.substr(0, 2) || "en"
        const response = await this.commandQueryExecutor.executeQuery('monetizationgrid', {
            type: 'monetizationgrid.usages.query.by-service',
            parameters: { serviceId: "OD", locale }
        });
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            const categories = (response.data as any).usages.map((it: { id: string, localized: string }) => ({ value: it.id, label: it.localized }))
            res.send(categories);
        } else {
            res.status(500).send(`Unexpected error when retrieving product categories : ${response.data}`);
        }
    }

}