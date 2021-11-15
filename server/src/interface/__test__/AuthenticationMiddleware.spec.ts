import "jest";
import { AccessToken, AuthenticationConfig, AuthenticationFailure, Authorization, Principal } from "lectra-auth-nodejs/dist";
import { Authentication } from "../../application/Authentication";
import { CommandQueryExecutorMockBuilder, mockHttpRequest, mockHttpResponse } from "../../__test__/Mocks";
import { AuthenticationMiddleware } from "../AuthenticationMiddleware";

describe("AuthenticationMiddleware", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const authorization =
    "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9EWTBSREJGTlVFM1JEVTVRVE13TVVRMk9EVXhRVFpCTkVRNU5qRTRPRUZETmprd09VVTRPQSJ9.eyJpc3MiOiJodHRwczovL2Rldi1sZWN0cmEtc2VydmljZXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5NmM4NTQ0NjE3NzdjMThhZjZmNDZlYyIsImF1ZCI6WyJodHRwczovL2dhdGV3YXktY3V0dGluZ3Jvb20uZGV2Lm15bGVjdHJhLmNvbSIsImh0dHBzOi8vZGV2LWxlY3RyYS1zZXJ2aWNlcy5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjAwMTgyMTk0LCJleHAiOjE2MDAyNjg1OTQsImF6cCI6IkxKaUVWRktZeUJNaURyS3c0ckN3VXRPcjdjN2tyNTFQIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2VzcyIsImd0eSI6InBhc3N3b3JkIn0.GHWuXyXFwtYeKiKXvDPH0OhW50qIqVqLqZLCpYsKG8_1_YIze8hZFXh7VUIKKzKTLAyVkY01g-HdMSVosZHtij3F9rGO3YMXOxcdEJcpKLr0FjL02MUpDI_26kQ7Wmv6kwLqCcIYQJp3AUeZyeBCqjAwZDtubAzK2DtSvV4qQZafzphHuuqrnvvS5sFKQdjT5o78-RqiN4tTNbZVkWfV7RTWJOb34OlUp256ABGxOCdr1bx7gZaheCi-272Yczeg2o-EnrXBuqoZT3e8vanNYx1RJRR29xZJ2FNXLZrNMj8YTZ85TUTqaeOidT8Xm-Y2ZocvK3PJfZ9R5pvAocSnRA";

  class MockAuthentication implements Authentication {
    private readonly principal: Principal;
    private readonly config: AuthenticationConfig;

    constructor(authDomain: string, tenantId?: string, permissions: string[] = []) {
      this.principal = new Principal("userId", tenantId ?? "123456789_A", "userLocale", [], permissions);
      this.config = {
        audience: "audience",
        clientId: "clientId",
        domain: `${authDomain}`,
      };
    }

    async authenticate(_: AccessToken): Promise<Principal | AuthenticationFailure> {
      return this.principal;
    }

    getConfig(): AuthenticationConfig {
      return this.config;
    }
  }

  it("should return 401 when missing authorization header", async () => {
    const req = mockHttpRequest(`/some-parameters`);
    const [res] = mockHttpResponse();
    const next = jest.fn();

    const mockAuthentication = new MockAuthentication("cutting-room-parameters.dev.mylectra.com");

    await new AuthenticationMiddleware(mockAuthentication, CommandQueryExecutorMockBuilder.newMock().build()).check(req, res, next);

    expect(res.statusCode).toEqual(401);
    expect(res._getData().message).toEqual("Missing Authorization header");
    expect(next.mock.calls.length).toEqual(0);
  });

  it("should return 401 when site permissions does not contains at least an authorized permission", async () => {
    const req = mockHttpRequest(`/some-parameters`);
    req.headers = { ...req.headers, authorization: authorization };
    const [res] = mockHttpResponse();
    const next = jest.fn();

    const mockAuthentication = new MockAuthentication("cutting-room-parameters.dev.mylectra.com", "123456789_A", ["UNKNOWN"]);

    await new AuthenticationMiddleware(mockAuthentication, CommandQueryExecutorMockBuilder.newMock().build()).check(req, res, next);

    expect(res.statusCode).toEqual(401);
    expect(res._getData().message).toEqual("Access denied: insufficient authorizations");
    expect(next.mock.calls.length).toEqual(0);
  });

  it("should return 401 when subscriptions service returns command failure", async () => {
    const req = mockHttpRequest(`/some-parameters`);
    req.headers = { ...req.headers, authorization: authorization };
    const [res] = mockHttpResponse();
    const next = jest.fn();

    const mockAuthentication = new MockAuthentication("cutting-room-parameters.dev.mylectra.com", "123456789_A", ["MASS_CUSTO"]);
    const mockSubscriptionsService = CommandQueryExecutorMockBuilder.newMock()
      .withCommandFailure("user-management-gateway", {
        type: "user-management-api.graphql",
        parameters: {
          "query": "query subscriptions($where:SubscriptionsWhereInput!) { subscriptions(where:$where) { offerId } }",
          "variables": {
            "where": {
              "tenantId": "123456789_A",
            },
          },
        },
      })
      .build();
    await new AuthenticationMiddleware(mockAuthentication, mockSubscriptionsService).check(req, res, next);

    expect(res.statusCode).toEqual(401);
    expect(res._getData().message).toEqual("Error retrieving tenant subscriptions");
    expect(next.mock.calls.length).toEqual(0);
  });

  const AUTHORIZED_PERMISSIONS = ["OD_FA", "OD_FU", "MASS_CUSTO", "MTO", "MTM", "SYS_MANAGER"];

  AUTHORIZED_PERMISSIONS.forEach((permission) =>
    it(`should call next when permission ${permission}`, async () => {
      const req = mockHttpRequest(`/some-parameters`);
      req.headers = { ...req.headers, authorization: authorization };
      const [res] = mockHttpResponse();
      const next = jest.fn();

      const mockAuthentication = new MockAuthentication("cutting-room-parameters.dev.mylectra.com", "CRT", ["UNKNOWN", permission]);
      await new AuthenticationMiddleware(
        mockAuthentication,
        CommandQueryExecutorMockBuilder.newMock()
          .withCommandSuccess(
            "user-management-gateway",
            {
              type: "user-management-api.graphql",
              parameters: {
                "query": "query subscriptions($where:SubscriptionsWhereInput!) { subscriptions(where:$where) { offerId } }",
                "variables": {
                  "where": {
                    "tenantId": "CRT",
                  },
                },
              },
            },
            {
              "data": {
                "subscriptions": [
                  {
                    "offerId": "ANY_OFFER_CODE",
                  },
                ],
              },
            }
          )
          .build()
      ).check(req, res, next);

      expect(res.statusCode).toEqual(200);
      expect(next.mock.calls.length).toEqual(1);
    })
  );
});
