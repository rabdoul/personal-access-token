import express = require("express");
import { CommandQueryExecutor, CommandResponseType, QueryResponseType } from "../../application/CommandQueryExecutor";
import { disableForSupport } from "../disableForSupport";
import { activityReferenceFromId } from "./ActivitiesMapping";
import { ListOperator, Operator, Statement } from "./model";

type PatchOperation = { op: "replace" | "add" | "remove"; path: string; value: Statement[] };

export class RulesResource {
  readonly router = express.Router();

  constructor(private readonly commandQueryExecutor: CommandQueryExecutor) {
    this.router.get("/api/rules/:activityId", this.get.bind(this));
    this.router.patch("/api/rules", this.patch.bind(this));
  }

  async get(req: express.Request, res: express.Response) {
    const activityReference = activityReferenceFromId(req.params.activityId);
    const response = await this.commandQueryExecutor.executeQuery("cutadmin",
      {
        type: "production-rules.query.getKnown",
        parameters: ["GenerateCuttingOrder", activityReference.split(' ').map(it => `${it.charAt(0).toUpperCase()}${it.slice(1)}`).join("")]
      }
    );
    if (response.type === QueryResponseType.QUERY_SUCCESS) {
      const conditionalBlocks = (response.data as any).activities[activityReference].conditionalBlocks;
      const rule = conditionalBlocks.sort((b1: { order: number }, b2: { order: number }) => b1.order - b2.order)
        .map((block: any) => {
          const conditions = block.conditions?.map((condition: any) => ({
            multipleOperator: ListOperator[condition.listOperator],
            reference: condition.leftOperand,
            operator: Operator[condition.operator],
            value: condition.rightOperand,
          })) || [];
          const { activityParametersType, ...result } = block.activityParameters;
          return { conditions, result };
        });
      res.send(rule);
    } else {
      res.status(500).send(`Unexpected error when retrieving setup sequencing rule : ${response.data}`);
    }
  }

  @disableForSupport()
  async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const patchOperations = req.body as PatchOperation[];
      if (patchOperations.length === 0) {
        res.status(200).send();
        return;
      }

      const queryResponse = await this.commandQueryExecutor.executeQuery("cutadmin",
        {
          type: "production-rules.query.getKnown",
          parameters: patchOperations.map(it => activityReferenceFromId(it.path)).map(it => it.split(' ').map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join("")).concat("GenerateCuttingOrder")
        }
      );

      if (queryResponse.type == QueryResponseType.QUERY_SUCCESS) {
        const parameters = this.applyPatches(queryResponse.data, patchOperations);
        const commandResponse = await this.commandQueryExecutor.executeCommand("cutadmin", { type: "production-rules.command.put", parameters });
        if (commandResponse.type == CommandResponseType.COMMAND_SUCCESS) {
          res.status(200).send();
        } else {
          res.status(500).send(`Unexpected error when patching rules : ${commandResponse.data}`);
        }
      } else {
        res.status(500).send(`Unexpected error when gettting rules for patch : ${queryResponse.data}`);
      }
    } catch (error) {
      next(error);
    }
  }

  private applyPatches(rules: any, patchOperations: PatchOperation[]): any {
    const activities = patchOperations
      .filter((it) => it.op === "replace")
      .map((it: PatchOperation) => {
        const rule = rules.activities[activityReferenceFromId(it.path)];
        const conditionalBlocks = it.value.map((statement, statementIndex) => this.toConditionalBlock(statement, statementIndex, rule.conditionConsequentType));
        return { ...rule, conditionalBlocks };
      })
      .reduce((acc, current) => ({ ...acc, [current.reference]: current }), {});

    return { ...rules, activities };
  }

  private toConditionalBlock(statement: Statement, statementIndex: number, conditionConsequentType: number) {
    return {
      conditionConsequentType,
      conditions:
        statement.conditions.length > 0
          ? statement.conditions.map((condition) => ({
            leftOperand: condition.reference,
            listOperator: ListOperator[condition.multipleOperator],
            operator: Operator[condition.operator],
            rightOperand: condition.value,
          }))
          : null,
      order: statementIndex,
      activityParameters: {
        activityParametersType: conditionConsequentType,
        ...statement.result,
      },
    };
  }
}
