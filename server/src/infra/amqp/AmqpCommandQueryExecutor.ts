import { Message } from "amqplib";
import { AmqpClient } from "amqplib-rt";

import LOGGER from "../../application/Logger";

import { Command, CommandResponse, CommandResponseType, Query, QueryResponse, QueryResponseType } from "../../application/CommandQueryExecutor";
import { CommandQueryExecutor } from "../../application/CommandQueryExecutor";
import { currentPrincipalOrNull, currentSubscriptions, Subscription } from "../../application/Authentication";

export class AmqpCommandQueryExecutor implements CommandQueryExecutor {
  constructor(private readonly amqpClient: AmqpClient) {}

  async executeCommand(exchange: string, command: Command): Promise<CommandResponse> {
    const message = await this.sendAndReceive(exchange, `${command.type}`, command.parameters);
    const type = message?.properties.type ?? "";
    const data = this.extractResponseData(message);
    switch (type) {
      case "command.success":
        return { type: CommandResponseType.COMMAND_SUCCESS, data };
      case "command.failure":
        LOGGER.error(
          { mdc: currentPrincipalOrNull() },
          `Command Failure, exchange=${exchange}, routingKey=${command.type}, parameters=${command.parameters}, response=${JSON.stringify(data)}`
        );
        return { type: CommandResponseType.COMMAND_FAILURE, data };
      default:
        return { type: CommandResponseType.COMMAND_FAILURE };
    }
  }

  async executeQuery(exchange: string, query: Query): Promise<QueryResponse> {
    const message = await this.sendAndReceive(exchange, `${query.type}`, query.parameters);
    const type = message?.properties.type ?? "";
    switch (type) {
      case "query.success":
      case "success": {
        const data = this.extractResponseData(message);
        return { type: QueryResponseType.QUERY_SUCCESS, data };
      }
      case "query.failure":
      case "failure": {
        const data = JSON.parse(message?.content.toString() || "");
        LOGGER.error(
          { mdc: currentPrincipalOrNull() },
          `Query Failure, exchange=${exchange}, routingKey=${query.type}, parameters=${JSON.stringify(query.parameters)}, response=${JSON.stringify(data)}`
        );
        return { type: QueryResponseType.QUERY_FAILURE, data };
      }
      default:
        return { type: QueryResponseType.QUERY_FAILURE };
    }
  }

  private extractResponseData(message: Message | undefined) {
    return message?.properties.contentType.toLowerCase().startsWith("application/json") ? JSON.parse(message.content.toString()) : message?.content;
  }

  private async sendAndReceive(exchange: string, routingKey: string, payload: object): Promise<Message | undefined> {
    const highestSubscription = this.computeHighestSubscription();
    return this.amqpClient.sendAndReceive(exchange, routingKey, Buffer.from(JSON.stringify(payload)), "application/json", {
      tenant_id: currentPrincipalOrNull()?.tenantId,
      api_version: "4.0",
      usage_offer: highestSubscription?.offer,
      market: highestSubscription?.market,
    });
  }

  private computeHighestSubscription(): Subscription | null {
    const subscriptions = currentSubscriptions()
      .map((s) => ({
        ...s,
        offerPriority: ManagedOffer[s.offer as keyof typeof ManagedOffer],
      }))
      .filter((s) => s.offerPriority !== undefined);
    return subscriptions.length > 0 ? subscriptions.reduce((a, b) => (a.offerPriority > b.offerPriority ? b : a)) : null;
  }
}

enum ManagedOffer {
  MP1,
  OD,
  MTM,
  MTC,
  MTO,
}
