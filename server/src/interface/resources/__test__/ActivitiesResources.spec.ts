import 'jest';
import { Principal } from 'lectra-auth-nodejs';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { ActivitiesResource, ActivityResource } from '../ActivitiesResource';

import { mocked } from 'ts-jest/utils';
import { currentPrincipal } from '../../../application/Authentication';

jest.mock('../../../application/Authentication');

describe('ActivitiesResource', () => {

    beforeEach(() => {
        mocked(currentPrincipal).mockImplementation(() => new Principal('sub|42', '123456789_A', 'en_EN', [{ offer: 'OD', market: 'FA' }]))
    });

    it('GET should return 200 if query success', async () => {
        const req = mockHttpRequest('/api/activities');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess(
            'cutadmin',
            { type: 'production-rules-configuration.query.get', parameters: {} },
            { activities: [{ reference: "Setup sequencing", order: 0, enabled: false, x: 2 }] }
        ).build();

        await new ActivitiesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ id: "setup-sequencing", order: 0, enabled: false }]);
    });

    it('toActivities should return all activities when user is authorized for OD', async () => {
        const activities = ActivitiesResource.toActivities({
            activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, eligibleProcess: [1] },
                { reference: "Analyse product order", order: 1, enabled: false, eligibleProcess: [2] },
                { reference: "Validate MTM Product", order: 2, enabled: false, eligibleProcess: [3] },
                { reference: "Generate batch", order: 3, enabled: false, eligibleProcess: [4] }
            ]
        });

        expect(activities).toEqual([
            { id: "setup-sequencing", order: 0, enabled: false },
            { id: "analyse-product-order", order: 1, enabled: false },
            { id: "validate-mtm-product", order: 2, enabled: false },
            { id: "generate-batch", order: 3, enabled: false }
        ]);
    });

    it('toActivities should not return any activity when user is authorized for non handled offer', async () => {
        mocked(currentPrincipal).mockImplementation(() => new Principal('1123456789_A', 'framboise@lectra.com', 'en_EN', [{ offer: 'C1', market: 'FA' }]))
        const activities = ActivitiesResource.toActivities({
            activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, eligibleProcess: [1] },
                { reference: "Analyse product order", order: 1, enabled: false, eligibleProcess: [2] },
                { reference: "Validate MTM Product", order: 2, enabled: false, eligibleProcess: [3] },
                { reference: "Generate batch", order: 3, enabled: false, eligibleProcess: [4] }
            ]
        });

        expect(activities).toEqual([]);
    });

    it('toActivities should return activities of corresponding offers', async () => {
        mocked(currentPrincipal).mockImplementation(() => new Principal('1123456789_A', 'framboise@lectra.com', 'en_EN', [{ offer: 'MTO', market: 'FA' }, { offer: 'MTC', market: 'FA' }]))
        const activities = ActivitiesResource.toActivities({
            activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, eligibleProcess: [1] },
                { reference: "Analyse product order", order: 1, enabled: false, eligibleProcess: [2] },
                { reference: "Validate MTM Product", order: 2, enabled: false, eligibleProcess: [3] },
                { reference: "Generate batch", order: 3, enabled: false, eligibleProcess: [1, 3] }
            ]
        });

        expect(activities).toEqual([
            { id: "setup-sequencing", order: 0, enabled: false },
            { id: "analyse-product-order", order: 1, enabled: false },
            { id: "generate-batch", order: 3, enabled: false }
        ])
    });

});

describe('ActivityResource', () => {
    it('GET should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/activities/validate-mtm-product', { id: 'validate-mtm-product' });
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure(
            'cutadmin',
            { type: 'production-rules-configuration.query.get', parameters: {} }
        ).build();

        await new ActivityResource(executor).get(req, res);

        expect(res.statusCode).toEqual(500);
    });

    it('GET should return 200 if query success', async () => {
        const req = mockHttpRequest('/api/activities/validate-mtm-product', { id: 'validate-mtm-product' });
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

        await new ActivityResource(executor).get(req, res);

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