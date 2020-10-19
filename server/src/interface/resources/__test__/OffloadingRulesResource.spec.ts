import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { MaterialGroupsResource } from '../MaterialSpecsResource';
import { OffloadingRulesResource } from '../OffloadingRulesResource';
import { ProductCategoriesResource } from '../ProductCategoriesResource';

describe('OffloadingRulesResource', () => {

    it('GET should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/offloading-rules');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure('cutadmin',
            { type: 'offloading-rule.query.list', parameters: {} }
        ).build();

        await new OffloadingRulesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });

    it('GET should return 200 with offloading list if query success', async () => {
        const req = mockHttpRequest('/api/offloading-rules');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('cutadmin',
            { type: 'offloading-rule.query.list', parameters: {} },
            [{
                offloadingRuleId: "5bb626d24e8eb45bd4067f47",
                reference: "Default offloading rule",
            }]
        ).build();

        await new OffloadingRulesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "5bb626d24e8eb45bd4067f47", label: "Default offloading rule" }]);
    });


});