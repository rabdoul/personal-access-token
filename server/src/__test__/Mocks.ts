import httpMocks = require('node-mocks-http');
import { CommandQueryExecutor, Query, QueryResponse, CommandResponse, Command, QueryResponseType, CommandResponseType } from '../application/CommandQueryExecutor';
import { currentPrincipalOrNull } from '../application/Authentication';
import { Response } from 'express';

export function mockHttpRequest(path: string, params: any = {}, body: any = {}, query: any = {}) {
  const req = httpMocks.createRequest({ path, params, body, query });
  req.protocol = 'http';
  req.headers = {
    host: 'localhost:28080'
  };
  return req;
}

export function mockHttpResponse(): [httpMocks.MockResponse<Response<any>>, (error: any) => void] {
  const response = httpMocks.createResponse();
  const errorHandler = (error: any) => response.status(500).send({ message: error.message })
  return [response, errorHandler];
}

class CommandQueryExecutorMock implements CommandQueryExecutor {
  constructor(readonly mockedQueryResponses: Map<string, QueryResponse> = new Map(), readonly mockedCommandResponses: Map<string, CommandResponse> = new Map()) { }

  executeCommand(exchange: string, command: Command): Promise<CommandResponse> {
    const response = this.mockedCommandResponses.get(CommandQueryExecutorMock.responseKey(exchange, command));
    if (!response) throw `Command response was not mocked, exchnage: ${exchange}, type: ${command.type}, params: ${command.parameters}`;
    return Promise.resolve(response);
  }

  executeQuery(exchange: string, query: Query): Promise<QueryResponse> {
    const response = this.mockedQueryResponses.get(CommandQueryExecutorMock.responseKey(exchange, query));
    if (!response) throw `Query response was not mocked, exchnage: ${exchange}, type: ${query.type}, params: ${query.parameters}`;
    return Promise.resolve(response);
  }

  static responseKey(exchnage: string, mocked: Query | Command): string {
    return `${currentPrincipalOrNull()?.tenantId ?? ''}${currentPrincipalOrNull()?.userId ?? ''}${exchnage}${mocked.type}` + JSON.stringify(mocked.parameters);
  }
}

export class CommandQueryExecutorMockBuilder {
  private clientMock: CommandQueryExecutorMock;

  private constructor() {
    this.clientMock = new CommandQueryExecutorMock();
  }

  static newMock(): CommandQueryExecutorMockBuilder {
    return new CommandQueryExecutorMockBuilder();
  }

  withQuerySuccess(exchange: string, query: Query, data: any): CommandQueryExecutorMockBuilder {
    const key = CommandQueryExecutorMock.responseKey(exchange, query);
    this.clientMock.mockedQueryResponses.set(key, { type: QueryResponseType.QUERY_SUCCESS, data });
    return this;
  }

  withQueryFailure(exchange: string, query: Query, data?: any): CommandQueryExecutorMockBuilder {
    const key = CommandQueryExecutorMock.responseKey(exchange, query);
    this.clientMock.mockedQueryResponses.set(key, { type: QueryResponseType.QUERY_FAILURE, data });
    return this;
  }

  withCommandSuccess(exchange: string, command: Command, data?: any): CommandQueryExecutorMockBuilder {
    const key = CommandQueryExecutorMock.responseKey(exchange, command);
    this.clientMock.mockedCommandResponses.set(key, { type: CommandResponseType.COMMAND_SUCCESS, data });
    return this;
  }

  withCommandFailure(exchange: string, command: Command, data?: any): CommandQueryExecutorMockBuilder {
    const key = CommandQueryExecutorMock.responseKey(exchange, command);
    this.clientMock.mockedCommandResponses.set(key, { type: CommandResponseType.COMMAND_FAILURE, data });
    return this;
  }

  build() {
    return this.clientMock;
  }
}