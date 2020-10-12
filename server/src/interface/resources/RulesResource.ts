import express = require('express');
const jsonpatch = require('fast-json-patch');
import { Operation } from 'fast-json-patch';
import { pick } from 'lodash';
import { CommandQueryExecutor, CommandResponseType, QueryResponseType } from '../../application/CommandQueryExecutor';
import { activityReferenceFromId } from "./ActivitiesMapping";
import { ListOperator, Operator, ValueSource, ValueType } from "./types";


type PatchOperation = {
    op: 'replace' | 'add' | 'remove',
    path: string,
    value: any
}

export class RulesResource {

    readonly router = express.Router();

    constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
        this.router.get('/api/rules/:activityId', this.get.bind(this))
        this.router.patch('/api/rules', this.patch.bind(this));
    }

    async get(req: express.Request, res: express.Response) {
        const response = await this.commandQueryExecutor.executeQuery('cutadmin', { type: 'production-rules.query.get', parameters: {} })
        if (response.type === QueryResponseType.QUERY_SUCCESS) {
            const data = (response.data as any).activities[activityReferenceFromId(req.params.activityId)];
            const rule = data.conditionalBlocks.sort((b1: { order: number }, b2: { order: number }) => b1.order - b2.order)
                .map((block: any) => {
                    const conditions = block.conditions?.map((condition: any) => ({
                        multipleOperator: ListOperator[condition.listOperator],
                        reference: condition.leftOperand,
                        operator: Operator[condition.operator],
                        value: condition.rightOperand
                    })) || [];
                    const { activityParametersType, ...result } = block.activityParameters
                    return { conditions, result };
                });
            res.send(rule);
        } else {
            res.status(500).send(`Unexpected error when retrieving setup sequencing rule : ${response.data}`);
        }
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
        const activities = patchOperations.filter(it => it.op === 'replace').map((it: PatchOperation) => {
            const inputRule = it.value as { conditions: Condition[], result: any }[];
            const activityReference = activityReferenceFromId(it.path);
            const rule = rules.activities[activityReference]
            const conditionalBlocks = inputRule.map((statement, statementIndex) => {
                return {
                    conditionConsequentType: rule.conditionConsequentType,
                    conditions: statement.conditions.length > 0 ? statement.conditions.map(condition => ({
                        leftOperand: condition.reference,
                        listOperator: ListOperator[condition.multipleOperator],
                        operator: Operator[condition.operator],
                        rightOperand: condition.value
                    })) : null,
                    order: statementIndex,
                    activityParameters: {
                        activityParametersType: rule.conditionConsequentType,
                        ...statement.result
                    }
                }
            })
            return { ...rule, conditionalBlocks }
        }).reduce((acc, current) => {
            return { ...acc, [current.reference]: current }
        }, {});

        return { ...rules, activities }
    }

}

type Condition = {
    reference: string;
    multipleOperator: ListOperator;
    operator: Operator;
    value: any;
};


