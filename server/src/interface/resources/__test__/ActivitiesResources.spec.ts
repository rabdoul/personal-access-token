import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { ActivitiesResource } from '../ActivitiesResource';

import { mocked } from 'ts-jest/utils';
import { currentSubscriptions, Subscription } from '../../../application/Authentication';

jest.mock('../../../application/Authentication');

describe('ActivitiesResource', () => {

    beforeEach(() => {
        mocked(currentSubscriptions).mockImplementation(() => [{ offer: 'OD', market: 'FA' }] as Subscription[]);
    });

    it('GET activities should return 200 if query success', async () => {
        const req = mockHttpRequest('/api/activities');
        const [res, errorHandler] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess(
            'cutadmin',
            { type: 'production-rules-configuration.query.get', parameters: {} },
            { activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, x: 2 },
                { reference: "New activity", order: 0, enabled: false, x: 2 }] }
        ).build();

        await new ActivitiesResource(executor).activities(req, res, errorHandler);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ id: "setup-sequencing", order: 0, enabled: false }]);
    });

    it('toActivities should return all activities when user has offer OD', async () => {
        const activities = ActivitiesResource.toActivities({
            activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, eligibleProcess: [1], eligibleConditions: [] },
                { reference: "Analyse product order", order: 1, enabled: false, eligibleProcess: [2], eligibleConditions: [] },
                { reference: "Validate MTM Product", order: 2, enabled: false, eligibleProcess: [3], eligibleConditions: [] },
                { reference: "Generate batch", order: 3, enabled: false, eligibleProcess: [4], eligibleConditions: [] }
            ]
        });

        expect(activities).toEqual([
            { id: "setup-sequencing", order: 0, enabled: false },
            { id: "analyse-product-order", order: 1, enabled: false },
            { id: "validate-mtm-product", order: 2, enabled: false },
            { id: "generate-batch", order: 3, enabled: false }
        ]);
    });

    it('toActivities should return all activities when tenant has offer MP1', async () => {
        mocked(currentSubscriptions).mockImplementation(() => [{ offer: 'MP1', market: '' }, { offer: 'MTO', market: '' }] as Subscription[]);
        const activities = ActivitiesResource.toActivities({
            activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, eligibleProcess: [1], eligibleConditions: [] },
                { reference: "Analyse product order", order: 1, enabled: false, eligibleProcess: [2], eligibleConditions: [] },
                { reference: "Validate MTM Product", order: 2, enabled: false, eligibleProcess: [3], eligibleConditions: [] },
                { reference: "Generate batch", order: 3, enabled: false, eligibleProcess: [4], eligibleConditions: [] }
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
        mocked(currentSubscriptions).mockImplementation(() => [{ offer: 'C1', market: 'FA' }] as Subscription[]);
        const activities = ActivitiesResource.toActivities({
            activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, eligibleProcess: [1], eligibleConditions: [] },
                { reference: "Analyse product order", order: 1, enabled: false, eligibleProcess: [2], eligibleConditions: [] },
                { reference: "Validate MTM Product", order: 2, enabled: false, eligibleProcess: [3], eligibleConditions: [] },
                { reference: "Generate batch", order: 3, enabled: false, eligibleProcess: [4], eligibleConditions: [] }
            ]
        });

        expect(activities).toEqual([]);
    });

    it('toActivities should return activities of corresponding offers', async () => {
        mocked(currentSubscriptions).mockImplementation(() => [{ offer: 'MTO', market: 'FA' }, { offer: 'MTC', market: 'FA' }] as Subscription[]);
        const activities = ActivitiesResource.toActivities({
            activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, eligibleProcess: [1], eligibleConditions: [] },
                { reference: "Analyse product order", order: 1, enabled: false, eligibleProcess: [2], eligibleConditions: [] },
                { reference: "Validate MTM Product", order: 2, enabled: false, eligibleProcess: [3], eligibleConditions: [] },
                { reference: "Generate batch", order: 3, enabled: false, eligibleProcess: [1, 3], eligibleConditions: [] }
            ]
        });

        expect(activities).toEqual([
            { id: "setup-sequencing", order: 0, enabled: false },
            { id: "analyse-product-order", order: 1, enabled: false },
            { id: "generate-batch", order: 3, enabled: false }
        ])
    });

    it('GET activity should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/activities/validate-mtm-product', { id: 'validate-mtm-product' });
        const [res, errorHandler] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure(
            'cutadmin',
            { type: 'production-rules-configuration.query.get', parameters: {} }
        ).build();

        await new ActivitiesResource(executor).activities(req, res, errorHandler);

        expect(res.statusCode).toEqual(500);
    });

    it('GET activity should return 200 if query success', async () => {
        const req = mockHttpRequest('/api/activities/validate-mtm-product', { id: 'validate-mtm-product' });
        const [res, errorHandler] = mockHttpResponse();

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

        await new ActivitiesResource(executor).activityConfiguration(req, res, errorHandler);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual({
            id: "validate-mtm-product",
            conditions: [
                {
                    reference: "command.reference",
                    multipleOperators: ["None"],
                    operators: ["Equals", "Different", "Contains"],
                    valueType: "String",
                    valueSource: "None",
                    predefinedValueSource: []
                },
                {
                    reference: "command.priority",
                    multipleOperators: ["None"],
                    operators: ["Equals", "Above", "Below", "Different"],
                    valueType: "String",
                    valueSource: "None",
                    predefinedValueSource: []
                }
            ]
        });
    });

    it('GET activity with marker.length condition should return value with unit Meter/Yard with 3 decimals', async () => {
        const req = mockHttpRequest('/api/activities/validate-marker', { id: 'validate-marker' });
        const [res, errorHandler] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess(
            'cutadmin',
            { type: 'production-rules-configuration.query.get', parameters: {} },
            {
                activities: [{
                    "reference":"Validate marker",
                    "eligibleProcess":[
                        1,
                        2,
                        3
                    ],
                    "order":9,
                    "enabled":true,
                    "eligibleConditions":[
                        {
                            "eligibleProcess":[
                                1,
                                2,
                                3
                            ],
                            "leftOperand":"marker.length",
                            "eligibleListOperator":[
                                0
                            ],
                            "eligibleOperator":[
                                0,
                                1,
                                2,
                                3
                            ],
                            "conditionType":1,
                            "predefinedRightOperand":[

                            ],
                            "rightOperandBindingSource":0,
                            "unitType":1
                        }
                    ],
                    "activityParameters":{
                        "name":"Validate marker",
                        "activityParametersType":6
                    }
                }]
            }
        ).build();

        await new ActivitiesResource(executor).activityConfiguration(req, res, errorHandler);

        expect(res.statusCode).toEqual(200);
        expect(res._getData().conditions[0].valueUnit).toEqual({
            metric: { decimalScale: 3, unit: 'm' },
            imperial: { decimalScale: 3, unit: 'yd' }
        });
    });

});