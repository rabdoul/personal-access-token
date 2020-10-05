import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { ValidateMTMProductActivityResource, ValidateMTMProductRuleResource } from "../ValidateMTMProductResources";

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

describe('ValidateMTMProductActivityResource', () => {
    it('GET should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/activities/validate-mtm-product');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure(
            'cutadmin',
            { type: 'production-rules-configuration.query.get', parameters: {} }
        ).build();

        await new ValidateMTMProductActivityResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });

    it('GET should return 200 if query success', async () => {
        const req = mockHttpRequest('/api/activities/validate-mtm-product');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess(
            'cutadmin',
            { type: 'production-rules-configuration.query.get', parameters: {} },
            {
                activities: [
                    {
                        "reference": "Validate MTM Product",
                        "eligibleProcess": [
                            2
                        ],
                        "order": 3,
                        "enabled": true,
                        "eligibleConditions": [
                            {
                                "eligibleProcess": [
                                    2
                                ],
                                "leftOperand": "command.reference",
                                "eligibleListOperator": [
                                    0
                                ],
                                "eligibleOperator": [
                                    0,
                                    3,
                                    4
                                ],
                                "conditionType": 0,
                                "predefinedRightOperand": [],
                                "rightOperandBindingSource": 0,
                                "unitType": 0
                            },
                            {
                                "eligibleProcess": [
                                    2
                                ],
                                "leftOperand": "command.priority",
                                "eligibleListOperator": [
                                    0
                                ],
                                "eligibleOperator": [
                                    0,
                                    1,
                                    2,
                                    3
                                ],
                                "conditionType": 0,
                                "predefinedRightOperand": [],
                                "rightOperandBindingSource": 0,
                                "unitType": 0
                            }],
                        "activityParameters": {
                            "name": "Validate MTM Product",
                            "activityParametersType": 2
                        }
                    },
                ]
            }
        ).build();

        await new ValidateMTMProductActivityResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual({
            conditions: [
                {
                    reference: "command.reference",
                    multipleOperator: ["None"],
                    operators: ["Equals", "Different", "Contains"],
                    valueType: "String",
                    valueSource: "None",
                    predefinedValues: []
                },
                {
                    reference: "command.priority",
                    multipleOperator: ["None"],
                    operators: ["Equals", "Above", "Below", "Different"],
                    valueType: "String",
                    valueSource: "None",
                    predefinedValues: []
                }
            ]
        });
    });
});