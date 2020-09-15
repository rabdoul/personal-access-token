import 'jest';
import { mockHttpRequest, mockHttpResponse } from '../../../__test__/Mocks';
import { HealthcheckResource } from '../HealthcheckResource';
import { Health, HealthIndicator } from '../../../application/HealthIndicator';

describe('HealthcheckResource', () => {

    it('/healthcheck should return OK if no indicators', async () => {
        const req = mockHttpRequest(`/healthcheck`);
        const [res] = mockHttpResponse();

        await new HealthcheckResource([]).healthcheck(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getHeaders()['content-type']).toEqual('text/plain');
        expect(res._getData()).toEqual('OK');
    })

    it('/healthcheck should return OK if all indicators are OK', async () => {
        const req = mockHttpRequest(`/healthcheck`);
        const [res] = mockHttpResponse();

        const cosmosDbIndicator: HealthIndicator = { name: () => "cosmosDb", health: () => Promise.resolve(Health.OK) }
        const rabbitMqIndicator: HealthIndicator = { name: () => "rabbitMq", health: () => Promise.resolve(Health.OK) }

        await new HealthcheckResource([rabbitMqIndicator, cosmosDbIndicator]).healthcheck(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getHeaders()['content-type']).toEqual('text/plain');
        expect(res._getData()).toEqual('OK');
    })

    it('/healthcheck should return KO if an indicator is KO', async () => {
        const req = mockHttpRequest(`/healthcheck`);
        const [res] = mockHttpResponse();

        const cosmosDbIndicator: HealthIndicator = { name: () => "cosmosDb", health: () => Promise.resolve(Health.OK) }
        const rabbitMqIndicator: HealthIndicator = { name: () => "rabbitmq", health: () => Promise.resolve(Health.KO) }

        await new HealthcheckResource([rabbitMqIndicator, cosmosDbIndicator]).healthcheck(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getHeaders()['content-type']).toEqual('text/plain');
        expect(res._getData()).toEqual('KO\nrabbitmq not available');
    })

})