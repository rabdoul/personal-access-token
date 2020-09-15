export interface Command {
  readonly type: string;
  readonly parameters: object;
}

export enum CommandResponseType {
  COMMAND_SUCCESS,
  COMMAND_FAILURE
}

export interface CommandResponse {
  readonly type: CommandResponseType;
  readonly data?: object;
}

export interface Query {
  readonly type: string;
  readonly parameters: object;
}

export enum QueryResponseType {
  QUERY_SUCCESS,
  QUERY_FAILURE
}

export interface QueryResponse {
  readonly type: QueryResponseType;
  readonly data?: object | Array<object>;
}

export interface CommandQueryExecutor {
  executeCommand(exchange: string, command: Command): Promise<CommandResponse>;
  executeQuery(exchange: string, query: Query): Promise<QueryResponse>;
}
