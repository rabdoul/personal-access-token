import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { CuttingRoomResource } from '../CuttingRoomResource';

describe('CuttingRoomResource', () => {

    it('GET should return 500 if one query failure', async () => {
        const req = mockHttpRequest('/api/cutting-room');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock()
            .withQuerySuccess('cuttingroomdefinition', { type: 'cuttingroomdefinition.cuttingroom.query.backlogs', parameters: {} }, [])
            .withQueryFailure('cuttingroomdefinition', { type: 'cuttingroomdefinition.cuttingroom.query.pairings', parameters: {} })
            .withQuerySuccess('cuttingroomdefinition', { type: 'cuttingroomdefinition.cutter-group.query.all', parameters: {} }, [])
            .withQuerySuccess('cuttingroomdefinition', { type: 'cuttingroomdefinition.spreader-group.query.all', parameters: {} }, [])
            .build();

        await new CuttingRoomResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });

    it('GET should return 200 if query success', async () => {
        const req = mockHttpRequest('/api/cutting-room');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock()
            .withQuerySuccess('cuttingroomdefinition', { type: 'cuttingroomdefinition.cuttingroom.query.backlogs', parameters: {} },
                [{
                    name: "Backlog Multi Vector",
                    id: "0cafe4a7-dd7e-4b20-8936-51b2b45fb148",
                    cutters: [{ name: "NP7PL9GXRF", id: "d192d5be-e109-4d9e-932a-a9f61730a2e7" }],
                    spreaders: [{ name: "NP7PL9GXRF", id: "d192d5be-e109-4d9e-932a-a9f61730a2e7" }]
                }]
            )
            .withQuerySuccess('cuttingroomdefinition', { type: 'cuttingroomdefinition.cuttingroom.query.pairings', parameters: {} },
                [{ from: "252b9d2e-992d-4b25-8ffe-8b5e0fc5f517", to: "d192d5be-e109-4d9e-932a-a9f61730a2e7" }]
            )
            .withQuerySuccess('cuttingroomdefinition', { type: 'cuttingroomdefinition.cutter-group.query.all', parameters: {} },
                [{ name: "VectorAutoiX6", id: "f6a3405d-8c3e-4f86-88f2-6f8608388d43" }]
            )
            .withQuerySuccess('cuttingroomdefinition', { type: 'cuttingroomdefinition.spreader-group.query.all', parameters: {} },
                [{ name: "LectraSpreader", id: "bedbe779-8aa2-4a2e-9df7-82dab309d4a4" }]
            )
            .build();

        await new CuttingRoomResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual({
            backlogs: [
                {
                    label: "Backlog Multi Vector",
                    value: "0cafe4a7-dd7e-4b20-8936-51b2b45fb148",
                    cutters: [{ label: "NP7PL9GXRF", value: "d192d5be-e109-4d9e-932a-a9f61730a2e7" }],
                    spreaders: [{ label: "NP7PL9GXRF", value: "d192d5be-e109-4d9e-932a-a9f61730a2e7" }]
                }
            ],
            pairings: [{ from: "252b9d2e-992d-4b25-8ffe-8b5e0fc5f517", to: "d192d5be-e109-4d9e-932a-a9f61730a2e7" }],
            cutterGroups: [{ label: "VectorAutoiX6", value: "f6a3405d-8c3e-4f86-88f2-6f8608388d43" }],
            spreaderGroups: [{ label: "LectraSpreader", value: "bedbe779-8aa2-4a2e-9df7-82dab309d4a4" }]
        });
    });


});