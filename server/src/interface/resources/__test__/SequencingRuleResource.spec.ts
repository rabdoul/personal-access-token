import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { SequencingRuleResource } from '../SequencingRuleResource';

describe('SequencingRuleResource', () => {

    it('GET should return 200 if query success', async () => {
        const req = mockHttpRequest('/api/setup-sequencing');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess(
            'cutadmin',
            { type: 'production-rules.query.get', parameters: {} },
            {
                activities: {
                    "Setup sequencing": {
                        conditionalBlocks: [{
                            activityParameters: {
                                "splitList": true,
                                "firstSubListSize": 7,
                                "activityParametersType": 12
                            }
                        }]
                    }
                }
            }
        ).build();

        await new SequencingRuleResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual({ splitCommandProducts: true, numberOfProductOrders: 7 });
    });

    it('GET should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/setup-sequencing');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure(
            'cutadmin',
            { type: 'production-rules.query.get', parameters: {} }
        ).build();

        await new SequencingRuleResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });


});