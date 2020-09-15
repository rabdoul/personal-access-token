import 'jest';
import { AmqpClient } from 'amqplib-rt';

import { AmqpHealthIndicator } from '../AmqpHealthIndicator';
import { Health } from '../../../application/HealthIndicator';

describe('AmqpHealthIndicator', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return OK if amqpClient is connected', async () => {
        const mockAmpClient = AmqpClient as jest.Mocked<typeof AmqpClient>;
        mockAmpClient.prototype.isConnected = () => Promise.resolve(true)

        const health = await new AmqpHealthIndicator(mockAmpClient.prototype).health()

        expect(health).toBe(Health.OK)
    })

    it('should return KO if amqpClient is not connected', async () => {
        const mockAmpClient = AmqpClient as jest.Mocked<typeof AmqpClient>;
        mockAmpClient.prototype.isConnected = () => Promise.resolve(false)

        const health = await new AmqpHealthIndicator(mockAmpClient.prototype).health()

        expect(health).toBe(Health.KO)
    })

    it('should return KO if amqpClient throw exeption', async () => {
        const mockAmpClient = AmqpClient as jest.Mocked<typeof AmqpClient>;
        mockAmpClient.prototype.isConnected = () => Promise.reject("Error")

        const health = await new AmqpHealthIndicator(mockAmpClient.prototype).health()

        expect(health).toBe(Health.KO)
    })


})