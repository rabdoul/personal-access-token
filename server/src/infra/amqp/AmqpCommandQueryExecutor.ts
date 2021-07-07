import { Message } from 'amqplib';
import { AmqpClient } from 'amqplib-rt';

import LOGGER from '../../application/Logger';

import { Command, CommandResponse, CommandResponseType, Query, QueryResponse, QueryResponseType } from '../../application/CommandQueryExecutor';
import { CommandQueryExecutor } from '../../application/CommandQueryExecutor';
import { currentPrincipalOrNull } from '../../application/Authentication';

export class AmqpCommandQueryExecutor implements CommandQueryExecutor {

  constructor(private readonly amqpClient: AmqpClient) { }

  async executeCommand(exchange: string, command: Command): Promise<CommandResponse> {
    const message = await this.sendAndReceive(exchange, `${command.type}`, command.parameters);
    const type = message?.properties.type ?? '';
    switch (type) {
      case 'command.success':
        return { type: CommandResponseType.COMMAND_SUCCESS };
      case 'command.failure':
        const data = JSON.parse(message?.content.toString() || '');
        LOGGER.error({ mdc: currentPrincipalOrNull() }, `Command Failure, exchange=${exchange}, routingKey=${command.type}, parameters=${command.parameters}, response=${JSON.stringify(data)}`);
        return { type: CommandResponseType.COMMAND_FAILURE, data };
      default:
        return { type: CommandResponseType.COMMAND_FAILURE };
    }
  }

  async executeQuery(exchange: string, query: Query): Promise<QueryResponse> {
    const message = await this.sendAndReceive(exchange, `${query.type}`, query.parameters);
    const type = message?.properties.type ?? '';
    switch (type) {
      case 'query.success':
      case 'success': {
        const data = message?.properties.contentType.toLowerCase().startsWith('application/json') ? JSON.parse(message.content.toString()) : message?.content;
        return { type: QueryResponseType.QUERY_SUCCESS, data };
      }
      case 'query.failure':
      case 'failure': {
        const data = JSON.parse(message?.content.toString() || '');
        LOGGER.error({ mdc: currentPrincipalOrNull() }, `Query Failure, exchange=${exchange}, routingKey=${query.type}, parameters=${JSON.stringify(query.parameters)}, response=${JSON.stringify(data)}`);
        return { type: QueryResponseType.QUERY_FAILURE, data };
      }
      default:
        return { type: QueryResponseType.QUERY_FAILURE };
    }
  }

  private async sendAndReceive(exchange: string, routingKey: string, payload: object): Promise<Message | undefined> {
    const authorization = currentPrincipalOrNull()?.authorizations.find(authoization => ["OD", "MTM", "MTC", "MTO", "MP1_AU"].includes(authoization.offer));
    return this.amqpClient.sendAndReceive(exchange, routingKey, Buffer.from(JSON.stringify(payload)), 'application/json', {
      tenant_id: currentPrincipalOrNull()?.tenantId,
      api_version: "4.0",
      usage_offer: authorization?.offer,
      market: authorization?.market
    })
  }
}
