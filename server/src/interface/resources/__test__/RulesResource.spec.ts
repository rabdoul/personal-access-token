import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { RulesResource } from '../RulesResource';

describe('RulesResource', () => {

    it('PATCH should return 500 if query failure', async () => {
        const req = mockHttpRequest('/api/rules');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure(
            'cutadmin',
            { type: 'production-rules.query.get', parameters: {} }
        ).build();

        await new RulesResource(executor).patch(req, res);

        expect(res.statusCode).toEqual(500);
    });

    it('PATCH should return 200 if command success with empty patch', async () => {
        const req = mockHttpRequest('/api/rules', {}, []);
        const [res] = mockHttpResponse();

        await new RulesResource(CommandQueryExecutorMockBuilder.newMock().build()).patch(req, res);

        expect(res.statusCode).toEqual(200);
    });

    it('PATCH should return 200 if command success', async () => {
        const req = mockHttpRequest('/api/rules', {}, [
            { "op": "replace", "path": "setup-sequencing", "value": { "splitCommandProducts": true, "numberOfProductOrders": 5 } }
        ]);
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock()
            .withQuerySuccess(
                'cutadmin',
                { type: 'production-rules.query.get', parameters: {} },
                {
                    "productionRulesId": "5c822a10f19e940001456210",
                    "activities": {
                        "Setup sequencing": {
                            "conditionConsequentType": 12,
                            "reference": "Setup sequencing",
                            "description": null,
                            "conditionalBlocks": [
                                {
                                    "conditionConsequentType": 12,
                                    "conditions": null,
                                    "order": 0,
                                    "activityParameters": {
                                        "splitList": false,
                                        "firstSubListSize": 7,
                                        "activityParametersType": 12
                                    }
                                }
                            ]
                        },
                        "Generate batch": {
                            "conditionConsequentType": 11,
                            "reference": "Generate batch",
                            "description": null,
                            "conditionalBlocks": [
                                {
                                    "conditionConsequentType": 11,
                                    "conditions": null,
                                    "order": 0,
                                    "activityParameters": {
                                        "activityParametersType": 11,
                                        "batchGenerationType": 0,
                                        "useMaxNumberOfOrder": false,
                                        "maxNumberOfOrders": 0,
                                        "criterions": null
                                    }
                                }
                            ]
                        }
                    }
                }
            )
            .withCommandSuccess(
                'cutadmin',
                {
                    type: 'production-rules.command.put',
                    parameters: {
                        "productionRulesId": "5c822a10f19e940001456210",
                        "activities": {
                            "Setup sequencing": {
                                "conditionConsequentType": 12,
                                "reference": "Setup sequencing",
                                "description": null,
                                "conditionalBlocks": [
                                    {
                                        "conditionConsequentType": 12,
                                        "conditions": null,
                                        "order": 0,
                                        "activityParameters": {
                                            "splitList": true,
                                            "firstSubListSize": 5,
                                            "activityParametersType": 12
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ).build();

        await new RulesResource(executor).patch(req, res);

        expect(res.statusCode).toEqual(200);
    });


});