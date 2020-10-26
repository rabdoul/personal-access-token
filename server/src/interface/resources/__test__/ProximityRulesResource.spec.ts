import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { ProximityRulesResource } from '../ProximityRulesResource';

describe('ProximityRulesResource', () => {

    it('GET should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/proximity-rules');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure('cutadmin',
            { type: 'proximity-rules.query.list', parameters: {} }
        ).build();

        await new ProximityRulesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });

    it('GET should return 200 with blocking list if query success', async () => {
        const req = mockHttpRequest('/api/proximity-rules');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('cutadmin',
            { type: 'proximity-rules.query.list', parameters: {} },
            [{
                proximityRulesId: "5bb626d24e8eb45bd4067f47",
                name: "Plain material proximity rule",
                materialProximityRules: [{ materialType: 8 }]
            },
            {
                proximityRulesId: "56983145268eb45bd4067f47",
                name: "Motif material proximity rule",
                materialProximityRules: [{ materialType: 4 }]
            }]
        ).build();

        await new ProximityRulesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([
            { value: "5bb626d24e8eb45bd4067f47", label: "Plain material proximity rule", isMotifRule: false },
            { value: "56983145268eb45bd4067f47", label: "Motif material proximity rule", isMotifRule: true },
        ]);
    });


});