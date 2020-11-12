import express = require('express');
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';

export class CuttingRoomResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/cutting-room', this.get.bind(this));
    }

    async get(_: express.Request, res: express.Response) {
        const responses = await Promise.all([
            this.commandQueryExecutor.executeQuery('cuttingroomdefinition', { type: 'cuttingroomdefinition.cuttingroom.query.backlogs', parameters: {} }),
            this.commandQueryExecutor.executeQuery('cuttingroomdefinition', { type: 'cuttingroomdefinition.cuttingroom.query.pairings', parameters: {} }),
            this.commandQueryExecutor.executeQuery('cuttingroomdefinition', { type: 'cuttingroomdefinition.cutter-group.query.all', parameters: {} }),
            this.commandQueryExecutor.executeQuery('cuttingroomdefinition', { type: 'cuttingroomdefinition.spreader-group.query.all', parameters: {} })
        ])
        if (responses.every(it => it.type === QueryResponseType.QUERY_SUCCESS)) {
            const backlogs = (responses[0].data as any[]).map(it => ({
                label: it.name,
                value: it.id,
                cutters: it.cutters.map((cutter: any) => ({ label: cutter.name, value: cutter.id })),
                spreaders: it.spreaders.map((cutter: any) => ({ label: cutter.name, value: cutter.id }))
            }))
            const cutterGroups = (responses[2].data as any[]).map(it => ({ label: it.name, value: it.id }));
            const spreaderGroups = (responses[3].data as any[]).map(it => ({ label: it.name, value: it.id }));
            res.send({ backlogs, pairings: responses[1].data, cutterGroups, spreaderGroups })
        } else {
            res.status(500).send('Unexpected error when retrieving the cutting room');
        }
    }

}