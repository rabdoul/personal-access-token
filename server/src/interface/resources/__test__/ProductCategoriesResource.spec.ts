import 'jest';
import { Principal } from 'lectra-auth-nodejs';
import { mocked } from 'ts-jest/utils';
import { currentPrincipal } from '../../../application/Authentication';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { ProductCategoriesResource } from '../ProductCategoriesResource';

jest.mock('../../../application/Authentication');

describe('ProductCategoriesResource', () => {

    beforeEach(() => {
        mocked(currentPrincipal).mockImplementation(() => new Principal('1123456789_A', 'framboise@lectra.com', 'en_EN', []))
    })

    it('GET should return 200 if query success', async () => {
        const req = mockHttpRequest('/api/product-categories');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess(
            'monetizationgrid',
            {
                type: 'monetizationgrid.usages.query.by-service',
                parameters: { serviceId: "OD", metricId: "POINT", locale: "en" }
            },
            { usages: [{ id: "shirt", localized: "Tops/Shirt" }] }
        ).build();

        await new ProductCategoriesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "shirt", label: "Tops/Shirt" }]);
    });

    it('GET doit retourner 200 si la requete est en succes', async () => {
        mocked(currentPrincipal).mockImplementation(() => new Principal('1123456789_A', 'french-framboise@lectra.com', 'fr_fr', []))

        const req = mockHttpRequest('/api/product-categories');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess(
            'monetizationgrid',
            {
                type: 'monetizationgrid.usages.query.by-service',
                parameters: { serviceId: "OD", metricId: "POINT", locale: "fr" }
            },
            { usages: [{ id: "shirt", localized: "Tops/Chemise" }] }
        ).build();

        await new ProductCategoriesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "shirt", label: "Tops/Chemise" }]);
    });

    it('GET should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/product-categories');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure(
            'monetizationgrid',
            {
                type: 'monetizationgrid.usages.query.by-service',
                parameters: { serviceId: "OD", metricId: "POINT", locale: "en" }
            }
        ).build();

        await new ProductCategoriesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });


});