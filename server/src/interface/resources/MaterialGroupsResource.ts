import express = require('express');
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

type ResponseData = {
    reference: string,
    [key: string]: string
}

export class MaterialGroupsResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/material-nesting-groups', this.nesting.bind(this))
        this.router.get('/api/material-cutting-groups', this.cutting.bind(this))
        this.router.get('/api/material-spreading-groups', this.spreading.bind(this))
    }

    async nesting(_: express.Request, res: express.Response) {
        this.retrieveAndSend('nesting', res);
    }

    async cutting(_: express.Request, res: express.Response) {
        this.retrieveAndSend('cutting', res);
    }

    async spreading(_: express.Request, res: express.Response) {
        this.retrieveAndSend('spreading', res);
    }

    private async retrieveAndSend(groupName: string, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('material', { type: `${groupName}-group.query.list`, parameters: {} });
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            res.send((response.data as ResponseData[]).map((it => ({ value: it[`${groupName}GroupId`], label: it.reference }))));
        } else {
            res.status(500).send(`Unexpected error when retrieving ${groupName} groups : ${response.data}`);
        }
    }

}