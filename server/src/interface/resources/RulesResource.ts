import express = require('express');
const jsonpatch = require('fast-json-patch');
import { Operation } from 'fast-json-patch';
import { pick } from 'lodash';
import { CommandQueryExecutor, CommandResponseType, QueryResponseType } from '../../application/CommandQueryExecutor';
import { activityReferenceFromId } from "./ActivitiesMapping";


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
        const patchOperations = req.body as PatchOperation[]
        if (patchOperations.length === 0) {
            res.status(200).send();
            return;
        }
        const queryResponse = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'production-rules.query.get', parameters: {} })
        if (queryResponse.type == QueryResponseType.QUERY_SUCCESS) {
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
        const sequencingPatchOp = patchOperations.filter(p => p.op === 'replace').find(p => p.path === 'setup-sequencing')
        if (sequencingPatchOp) {
            const activityReference = activityReferenceFromId('setup-sequencing')
            rules.activities = pick(rules.activities, [activityReference])
            const patch: Operation[] = [
                { op: 'replace', path: `/activities/${activityReference}/conditionalBlocks/0/activityParameters/splitList`, value: sequencingPatchOp.value['splitCommandProducts'] },
                { op: 'replace', path: `/activities/${activityReference}/conditionalBlocks/0/activityParameters/firstSubListSize`, value: sequencingPatchOp.value['numberOfProductOrders'] },
            ];
            return jsonpatch.applyPatch(rules, patch).newDocument
        } else {
            return rules
        }

    }

}