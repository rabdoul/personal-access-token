import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { OffloadingRulesResource } from '../OffloadingRulesResource';
import { ProductionLinesResource } from '../ProductionLinesResource';

describe('ProductionLinesResource', () => {

    it('GET should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/production-lines');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure('cutadmin',
            { type: 'production-line.query.list', parameters: {} }
        ).build();

        await new ProductionLinesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });

    it('GET should return 200 with offloading list if query success', async () => {
        const req = mockHttpRequest('/api/production-lines');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('cutadmin',
            { type: 'production-line.query.list', parameters: {} },
            [{
                "productionLineId": "59e5f726892e552e2c7f1144",
                "reference": "PL Raspberry",
                "canopyName": "canopy.1",
                "comment": "Comment",
                "productionLineComponentIds": [
                    "59e5f6d4892e552e2c7f1143"
                ],
                "version": "V1R0"
            }]
        ).build();

        await new ProductionLinesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "59e5f726892e552e2c7f1144", label: "PL Raspberry" }]);
    });


});