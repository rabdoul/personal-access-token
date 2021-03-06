import "jest";
import { Principal } from "lectra-auth-nodejs";
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from "../../../__test__/Mocks";
import { RulesResource } from "../RulesResource";
jest.mock("../../../application/Authentication");
const { currentPrincipal } = require("../../../application/Authentication");

describe("RulesResource", () => {
  beforeEach(() => {
    currentPrincipal.mockImplementation(() => new Principal("1123456789_A", "framboise@lectra.com", "en_EN", [], [], "SUPPORT_OR_NOT"));
  });

  it("GET should return 500 if query failure", async () => {
    const req = mockHttpRequest("/api/rules/associate-cutting-requirements", { activityId: "associate-cutting-requirements" });
    const [res] = mockHttpResponse();
    const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure("cutadmin", { type: "production-rules.query.getKnown", parameters: ["GenerateCuttingOrder", "AssociateCuttingRequirements"] }).build();

    await new RulesResource(executor).get(req, res);

    expect(res.statusCode).toEqual(500);
  });

  it("GET should return 200 if query success", async () => {
    const req = mockHttpRequest("/api/rules/associate-cutting-requirements", { activityId: "associate-cutting-requirements" });
    const [res] = mockHttpResponse();

    const executor = CommandQueryExecutorMockBuilder.newMock()
      .withQuerySuccess(
        "cutadmin",
        { type: "production-rules.query.getKnown", parameters: ["GenerateCuttingOrder", "AssociateCuttingRequirements"] },
        {
          activities: {
            "Associate cutting requirements": {
              reference: "Associate cutting requirements",
              conditionalBlocks: [
                {
                  conditionConsequentType: 7,
                  conditions: [
                    {
                      leftOperand: "material.color",
                      listOperator: 0,
                      operator: 3,
                      rightOperand: "Blue",
                    },
                  ],
                  order: 0,
                  activityParameters: {
                    activityParametersType: 7,
                    requirementId: "5eea2e7958c60c000135f1cd",
                  },
                },
                {
                  conditionConsequentType: 7,
                  conditions: [
                    {
                      leftOperand: "material.color",
                      listOperator: 0,
                      operator: 0,
                      rightOperand: "Red",
                    },
                  ],
                  order: 1,
                  activityParameters: {
                    activityParametersType: 7,
                    requirementId: "5eea2e7a4dd86a00014ddb0c",
                  },
                },
                {
                  conditionConsequentType: 7,
                  conditions: null,
                  order: 2,
                  activityParameters: {
                    activityParametersType: 7,
                    requirementId: null,
                  },
                },
              ],
            },
          },
        }
      )
      .build();

    await new RulesResource(executor).get(req, res);

    expect(res.statusCode).toEqual(200);
    expect(res._getData()).toEqual([
      { conditions: [{ reference: "material.color", multipleOperator: "None", operator: "Different", value: "Blue" }], result: { requirementId: "5eea2e7958c60c000135f1cd" } },
      { conditions: [{ reference: "material.color", multipleOperator: "None", operator: "Equals", value: "Red" }], result: { requirementId: "5eea2e7a4dd86a00014ddb0c" } },
      { conditions: [], result: { requirementId: null } },
    ]);
  });

  it("PATCH should return 500 if query failure", async () => {
    const req = mockHttpRequest("/api/rules");
    const [res, errorHandler] = mockHttpResponse();

    const executor = CommandQueryExecutorMockBuilder.newMock().withQueryFailure("cutadmin", { type: "production-rules.query.get", parameters: {} }).build();

    await new RulesResource(executor).patch(req, res, errorHandler);

    expect(res.statusCode).toEqual(500);
  });

  it("PATCH should return 403 if support user", async () => {
    const req = mockHttpRequest("/api/rules", {}, []);
    const [res, errorHandler] = mockHttpResponse();
    currentPrincipal.mockImplementation(() => new Principal("1123456789_A", "framboise@lectra.com", "en_EN", [], [], "SUPPORT"));
    await new RulesResource(CommandQueryExecutorMockBuilder.newMock().build()).patch(req, res, errorHandler);
    expect(res.statusCode).toEqual(403);
  });

  it("PATCH should return 200 if command success with empty patch", async () => {
    const req = mockHttpRequest("/api/rules", {}, []);
    const [res, errorHandler] = mockHttpResponse();

    await new RulesResource(CommandQueryExecutorMockBuilder.newMock().build()).patch(req, res, errorHandler);

    expect(res.statusCode).toEqual(200);
  });

  it("PATCH should return 200 if command success with two patch operations", async () => {
    const req = mockHttpRequest("/api/rules", {}, [
      { op: "replace", path: "setup-sequencing", value: [{ conditions: [], result: { splitList: true, firstSubListSize: 5 } }] },
      {
        op: "replace",
        path: "validate-mtm-product",
        value: [
          {
            conditions: [
              { reference: "command.reference", multipleOperator: "None", operator: "Equals", value: "CMD-100" },
              { reference: "command.priority", multipleOperator: "None", operator: "Above", value: 3 },
            ],
            result: { stopOnOutOfRangeWarning: false, stopOnIncorrectValueWarning: true },
          },
          { conditions: [], result: { stopOnOutOfRangeWarning: true, stopOnIncorrectValueWarning: true } },
        ],
      },
    ]);
    const [res, errorHandler] = mockHttpResponse();

    const executor = CommandQueryExecutorMockBuilder.newMock()
      .withQuerySuccess(
        "cutadmin",
        { type: "production-rules.query.getKnown", parameters: ["SetupSequencing", "ValidateMTMProduct", "GenerateCuttingOrder"] },
        {
          productionRulesId: "5c822a10f19e940001456210",
          activities: {
            "Setup sequencing": {
              conditionConsequentType: 12,
              reference: "Setup sequencing",
              description: null,
              conditionalBlocks: [
                {
                  conditionConsequentType: 12,
                  conditions: null,
                  order: 0,
                  activityParameters: {
                    splitList: false,
                    firstSubListSize: 7,
                    activityParametersType: 12,
                  },
                },
              ],
            },
            "Validate MTM Product": {
              conditionConsequentType: 2,
              reference: "Validate MTM Product",
              description: null,
              conditionalBlocks: [
                {
                  conditionConsequentType: 2,
                  conditions: null,
                  order: 0,
                  activityParameters: {
                    activityParametersType: 2,
                    stopOnOutOfRangeWarning: false,
                    stopOnIncorrectValueWarning: false,
                  },
                },
              ],
            },
            "Generate batch": {
              conditionConsequentType: 11,
              reference: "Generate batch",
              description: null,
              conditionalBlocks: [
                {
                  conditionConsequentType: 11,
                  conditions: null,
                  order: 0,
                  activityParameters: {
                    activityParametersType: 11,
                    batchGenerationType: 0,
                    useMaxNumberOfOrder: false,
                    maxNumberOfOrders: 0,
                    criterions: null,
                  },
                },
              ],
            },
          },
        }
      )
      .withCommandSuccess("cutadmin", {
        type: "production-rules.command.put",
        parameters: {
          productionRulesId: "5c822a10f19e940001456210",
          activities: {
            "Setup sequencing": {
              conditionConsequentType: 12,
              reference: "Setup sequencing",
              description: null,
              conditionalBlocks: [
                {
                  conditionConsequentType: 12,
                  conditions: null,
                  order: 0,
                  activityParameters: {
                    activityParametersType: 12,
                    splitList: true,
                    firstSubListSize: 5,
                  },
                },
              ],
            },
            "Validate MTM Product": {
              conditionConsequentType: 2,
              reference: "Validate MTM Product",
              description: null,
              conditionalBlocks: [
                {
                  conditionConsequentType: 2,
                  conditions: [
                    {
                      leftOperand: "command.reference",
                      listOperator: 0,
                      operator: 0,
                      rightOperand: "CMD-100",
                    },
                    {
                      leftOperand: "command.priority",
                      listOperator: 0,
                      operator: 1,
                      rightOperand: 3,
                    },
                  ],
                  order: 0,
                  activityParameters: {
                    activityParametersType: 2,
                    stopOnOutOfRangeWarning: false,
                    stopOnIncorrectValueWarning: true,
                  },
                },
                {
                  conditionConsequentType: 2,
                  conditions: null,
                  order: 1,
                  activityParameters: {
                    activityParametersType: 2,
                    stopOnOutOfRangeWarning: true,
                    stopOnIncorrectValueWarning: true,
                  },
                },
              ],
            },
          },
        },
      })
      .build();

    await new RulesResource(executor).patch(req, res, errorHandler);

    expect(res.statusCode).toEqual(200);
  });
});
