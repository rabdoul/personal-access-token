import 'jest';
import { Message } from 'amqplib';
import { AmqpClient } from 'amqplib-rt';

import { AmqpCommandQueryExecutor } from '../AmqpCommandQueryExecutor';
import { CommandResponseType, QueryResponseType } from '../../../application/CommandQueryExecutor';

describe('AmqpCommandQueryExecutor -> executeCommand', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    type TestCase = {
        messageType: string;
        responseType: CommandResponseType
    }

    const TEST_CASES: TestCase[] = [
        { messageType: 'command.failure', responseType: CommandResponseType.COMMAND_FAILURE },
        { messageType: 'command.success', responseType: CommandResponseType.COMMAND_SUCCESS },
    ]

    TEST_CASES.forEach(({ messageType, responseType }) => {

        it(`should return ${responseType} if sendAndReceive returns a message with type ${messageType}`, async () => {
            const mockAmpClient = AmqpClient as jest.Mocked<typeof AmqpClient>;
            mockAmpClient.prototype.sendAndReceive = () => Promise.resolve(newMessage({}, messageType))

            const commandResponse = await new AmqpCommandQueryExecutor(mockAmpClient.prototype).executeCommand('exchange', { type: 'routingKey', parameters: {} })

            expect(commandResponse.type).toBe(responseType)
        })

    })

})

describe('AmqpCommandQueryExecutor -> executeQuery', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    type TestCase = {
        messageType: string;
        responseType: QueryResponseType
        response: object
    }

    const TEST_CASES: TestCase[] = [
        { messageType: 'query.failure', responseType: QueryResponseType.QUERY_FAILURE, response: {} },
        { messageType: 'failure', responseType: QueryResponseType.QUERY_FAILURE, response: {} },
        { messageType: 'query.success', responseType: QueryResponseType.QUERY_SUCCESS, response: { reference: '123' } },
        { messageType: 'success', responseType: QueryResponseType.QUERY_SUCCESS, response: { reference: '123' } },
    ]

    TEST_CASES.forEach(({ messageType, responseType, response }) => {

        it(`should return ${responseType} with data ${response} if sendAndReceive returns a message with type ${messageType} and data ${response}`, async () => {
            const mockAmpClient = AmqpClient as jest.Mocked<typeof AmqpClient>;
            mockAmpClient.prototype.sendAndReceive = () => Promise.resolve(newMessage(response, messageType))

            const queryResponse = await new AmqpCommandQueryExecutor(mockAmpClient.prototype).executeQuery('exchange', { type: 'routingKey', parameters: {} })

            expect(queryResponse.type).toBe(responseType)
            expect(queryResponse.data).toStrictEqual(response)
        })
    })

})

function newMessage(payload: object, type: string): Message {
    return {
        content: Buffer.from(JSON.stringify(payload)),
        fields: {
            deliveryTag: 0,
            exchange: '',
            routingKey: '',
            redelivered: false
        },
        properties: {
            contentType: 'application/json',
            contentEncoding: '',
            headers: {},
            deliveryMode: '',
            priority: '',
            correlationId: '',
            replyTo: '',
            expiration: '',
            messageId: '',
            timestamp: '',
            type,
            userId: '',
            appId: '',
            clusterId: ''
        }
    }
}