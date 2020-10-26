import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { PositioningRulesResource } from '../PositioningRulesResource';

describe('PositioningRulesResource', () => {

    it('GET should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/positioning-rules');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure('cutadmin',
            { type: 'zone-positioning-rules.query.list', parameters: {} }
        ).build();

        await new PositioningRulesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });

    it('GET should return 200 with positioning list if query success', async () => {
        const req = mockHttpRequest('/api/proximity-rules');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('cutadmin',
            { type: 'zone-positioning-rules.query.list', parameters: {} },
            [{
                zonePositioningRuleId: "5bb626d24e8eb45bd4067f47",
                reference: "Default positioning rule"
            }]
        ).build();

        await new PositioningRulesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "5bb626d24e8eb45bd4067f47", label: "Default positioning rule" }]);
    });


});