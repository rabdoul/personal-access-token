import "jest";
import { Message } from "amqplib";
import { AmqpClient } from "amqplib-rt";

import { AmqpCommandQueryExecutor } from "../AmqpCommandQueryExecutor";
import { CommandResponseType, QueryResponseType } from "../../../application/CommandQueryExecutor";
import { mocked } from "ts-jest/utils";
import { currentSubscriptions, Subscription } from "../../../application/Authentication";

jest.mock('../../../application/Authentication');

describe("AmqpCommandQueryExecutor -> executeCommand", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mocked(currentSubscriptions).mockImplementation(() => [] as Subscription[]);
  });

  type TestCase = {
    messageType: string;
    responseType: CommandResponseType;
    response: object;
  };

  const TEST_CASES: TestCase[] = [
    { messageType: "command.failure", responseType: CommandResponseType.COMMAND_FAILURE, response: {} },
    { messageType: "command.failure", responseType: CommandResponseType.COMMAND_FAILURE, response: { error: "boom" } },
    { messageType: "command.success", responseType: CommandResponseType.COMMAND_SUCCESS, response: {} },
    { messageType: "command.success", responseType: CommandResponseType.COMMAND_SUCCESS, response: { toto: "titi" } },
  ];

  TEST_CASES.forEach(({ messageType, responseType, response }) => {
    it(`should return ${responseType} if sendAndReceive returns a message with type ${messageType} and data ${JSON.stringify(response)}`, async () => {
      const mockAmpClient = AmqpClient as jest.Mocked<typeof AmqpClient>;
      mockAmpClient.prototype.sendAndReceive = () => Promise.resolve(newMessage(response, messageType));

      const commandResponse = await new AmqpCommandQueryExecutor(mockAmpClient.prototype).executeCommand("exchange", { type: "routingKey", parameters: {} });

      expect(commandResponse.type).toBe(responseType);
      expect(commandResponse.data).toStrictEqual(response);
    });
  });

  it(`should send with usageOffer and market in AMQP headers`, async () => {
    const mockAmpClient = AmqpClient as jest.Mocked<typeof AmqpClient>;
    const mockSendAndReceive = jest.fn(() => Promise.resolve(newMessage({}, "command.success")));
    mocked(currentSubscriptions).mockImplementationOnce(() => [{ offer: 'MP1', market: 'FA' }, { offer: 'OD', market: '' }] as Subscription[]);

    mockAmpClient.prototype.sendAndReceive = mockSendAndReceive;

    const response = await new AmqpCommandQueryExecutor(mockAmpClient.prototype).executeCommand("exchange", { type: "routingKey", parameters: {} });

    expect(response.type).toStrictEqual(CommandResponseType.COMMAND_SUCCESS);

    expect((mockSendAndReceive.mock.calls[0] as Array<any>)[4].usage_offer).toStrictEqual("MP1");
    expect((mockSendAndReceive.mock.calls[0] as Array<any>)[4].market).toStrictEqual("FA");
  });
});

describe("AmqpCommandQueryExecutor -> executeQuery", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mocked(currentSubscriptions).mockImplementation(() => [] as Subscription[]);
  });

  type TestCase = {
    messageType: string;
    responseType: QueryResponseType;
    response: object;
  };

  const TEST_CASES: TestCase[] = [
    { messageType: "query.failure", responseType: QueryResponseType.QUERY_FAILURE, response: {} },
    { messageType: "failure", responseType: QueryResponseType.QUERY_FAILURE, response: {} },
    { messageType: "query.success", responseType: QueryResponseType.QUERY_SUCCESS, response: { reference: "123" } },
    { messageType: "success", responseType: QueryResponseType.QUERY_SUCCESS, response: { reference: "123" } },
  ];

  TEST_CASES.forEach(({ messageType, responseType, response }) => {
    it(`should return ${responseType} with data ${response} if sendAndReceive returns a message with type ${messageType} and data ${response}`, async () => {
      const mockAmpClient = AmqpClient as jest.Mocked<typeof AmqpClient>;
      mockAmpClient.prototype.sendAndReceive = () => Promise.resolve(newMessage(response, messageType));

      const queryResponse = await new AmqpCommandQueryExecutor(mockAmpClient.prototype).executeQuery("exchange", { type: "routingKey", parameters: {} });
      expect(queryResponse.type).toBe(responseType);
      expect(queryResponse.data).toStrictEqual(response);
    });
  });

  it(`should send with usageOffer and market in AMQP headers`, async () => {
    const mockAmpClient = AmqpClient as jest.Mocked<typeof AmqpClient>;
    const mockSendAndReceive = jest.fn(() => Promise.resolve(newMessage({}, "query.success")));
    mocked(currentSubscriptions).mockImplementationOnce(() => [{ offer: 'MP1', market: 'FA' }, { offer: 'OD', market: '' }] as Subscription[]);

    mockAmpClient.prototype.sendAndReceive = mockSendAndReceive;

    const response = await new AmqpCommandQueryExecutor(mockAmpClient.prototype).executeQuery("exchange", { type: "routingKey", parameters: {} });

    expect(response.type).toStrictEqual(QueryResponseType.QUERY_SUCCESS);

    expect((mockSendAndReceive.mock.calls[0] as Array<any>)[4].usage_offer).toStrictEqual("MP1");
    expect((mockSendAndReceive.mock.calls[0] as Array<any>)[4].market).toStrictEqual("FA");
  });
});

function newMessage(payload: object, type: string): Message {
  return {
    content: Buffer.from(JSON.stringify(payload)),
    fields: {
      deliveryTag: 0,
      exchange: "",
      routingKey: "",
      redelivered: false,
    },
    properties: {
      contentType: "application/json",
      contentEncoding: "",
      headers: {},
      deliveryMode: "",
      priority: "",
      correlationId: "",
      replyTo: "",
      expiration: "",
      messageId: "",
      timestamp: "",
      type,
      userId: "",
      appId: "",
      clusterId: "",
    },
  };
}
