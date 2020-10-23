import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { BlockingRulesResource } from '../BlockingRulesResource';

describe('BlockingRulesResource', () => {

    it('GET should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/blocking-rules');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure('cutadmin',
            { type: 'blocking-rule.query.list', parameters: {} }
        ).build();

        await new BlockingRulesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });

    it('GET should return 200 with blocking list if query success', async () => {
        const req = mockHttpRequest('/api/blocking-rules');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('cutadmin',
            { type: 'blocking-rule.query.list', parameters: {} },
            [{
                blockingRuleId: "5bb626d24e8eb45bd4067f47",
                reference: "Default blocking rule",
                isMotifRule: false
            }]
        ).build();

        await new BlockingRulesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "5bb626d24e8eb45bd4067f47", label: "Default blocking rule", isMotifRule: false }]);
    });


});