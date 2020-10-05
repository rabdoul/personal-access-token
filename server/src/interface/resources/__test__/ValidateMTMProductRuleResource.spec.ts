import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { ValidateMTMProductRuleResource } from "../ValidateMTMProductRuleResource";

describe('ValidateMTMProductRuleResource', () => {

    it('GET should return 200 if query success', async () => {
        const req = mockHttpRequest('/api/validate-mtm-product');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess(
            'cutadmin',
            { type: 'production-rules.query.get', parameters: {} },
            {
                activities: {
                    "Validate MTM Product": {
                        conditionalBlocks: [{
                            activityParameters: {
                                "stopOnOutOfRangeWarning": true,
                                "stopOnIncorrectValueWarning": false,
                                "activityParametersType": 2
                            }
                        }]
                    }
                }
            }
        ).build();

        await new ValidateMTMProductRuleResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual({ stopOnOutOfRangeWarning: true, stopOnIncorrectValueWarning: false });
    });

    it('GET should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/validate-mtm-product');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure(
            'cutadmin',
            { type: 'production-rules.query.get', parameters: {} }
        ).build();

        await new ValidateMTMProductRuleResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });
});