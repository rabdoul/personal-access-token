import express = require('express');
import { currentPrincipal } from '../../application/Authentication';
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

export class RequirementsResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/requirements', this.get.bind(this))
    }

    async get(_: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutparameters', {
            type: 'cut-requirement-parameters.query.searchCustom',
            parameters: { TenantId: currentPrincipal().tenantId, FieldsToFill: ["Meta.Ident", "Meta.Level"] }
        });
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            const requirements = (response.data as any[])
                .filter(it => it.Meta.Level === "user")
                .map(it => ({ label: it.Meta.Ident, value: it.Id }))
            res.send(requirements);
        } else {
            res.status(500).send(`Unexpected error when retrieving product categories : ${response.data}`);
        }
    }

}