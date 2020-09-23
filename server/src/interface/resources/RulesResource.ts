import express = require('express');
import { CommandQueryExecutor, CommandResponseType, QueryResponseType } from '../../application/CommandQueryExecutor';

type PatchOperation = {
    op: 'replace' | 'add' | 'remove',
    path: string,
    value: any
}

export class RulesResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.patch('/api/rules', this.patch.bind(this))
    }

    async patch(req: express.Request, res: express.Response) {
        const queryResponse = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'production-rules.query.get', parameters: {} })
        if (queryResponse.type == QueryResponseType.QUERY_SUCCESS) {
            const patchOperations = req.body as PatchOperation[]
            console.log("patchOperations", patchOperations)
            const parameters = this.applyPatches(queryResponse.data, patchOperations);
            const commandResponse = await this.commandQueryExecutor.executeCommand('cutadmin', { type: 'production-rules.command.put', parameters })
            if (commandResponse.type == CommandResponseType.COMMAND_SUCCESS) {
                res.status(200).send()
            } else {
                res.status(500).send(`Unexpected error when patching rules : ${commandResponse.data}`);
            }
        } else {
            res.status(500).send(`Unexpected error when gettting rules for patch : ${queryResponse.data}`);
        }
    }

    applyPatches(rules: any, patchOperations: PatchOperation[]): any {
        const sequencingPatchOp = patchOperations.filter(p => p.op === 'replace').find(p => p.path === 'Setup sequencing')!
        rules['activities']['Setup sequencing']['conditionalBlocks'][0]['activityParameters']['splitList'] = sequencingPatchOp.value['splitCommandProducts']
        rules['activities']['Setup sequencing']['conditionalBlocks'][0]['activityParameters']['firstSubListSize'] = sequencingPatchOp.value['numberOfProductOrders']
        return rules;
    }

}