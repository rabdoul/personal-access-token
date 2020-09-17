import 'jest';
import {mockHttpRequest, mockHttpResponse} from '../../__test__/Mocks';
import {AuthenticationMiddleware} from "../AuthenticationMiddleware";
import {
  AccessToken,
  AuthenticationConfig,
  AuthenticationFailure,
  Authorization,
  Principal
} from "lectra-auth-nodejs/dist";
import {Authentication} from "../../application/Authentication";

describe('AuthenticationMiddleware', () => {

  const authorization = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9EWTBSREJGTlVFM1JEVTVRVE13TVVRMk9EVXhRVFpCTkVRNU5qRTRPRUZETmprd09VVTRPQSJ9.eyJpc3MiOiJodHRwczovL2Rldi1sZWN0cmEtc2VydmljZXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDU5NmM4NTQ0NjE3NzdjMThhZjZmNDZlYyIsImF1ZCI6WyJodHRwczovL2dhdGV3YXktY3V0dGluZ3Jvb20uZGV2Lm15bGVjdHJhLmNvbSIsImh0dHBzOi8vZGV2LWxlY3RyYS1zZXJ2aWNlcy5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjAwMTgyMTk0LCJleHAiOjE2MDAyNjg1OTQsImF6cCI6IkxKaUVWRktZeUJNaURyS3c0ckN3VXRPcjdjN2tyNTFQIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2VzcyIsImd0eSI6InBhc3N3b3JkIn0.GHWuXyXFwtYeKiKXvDPH0OhW50qIqVqLqZLCpYsKG8_1_YIze8hZFXh7VUIKKzKTLAyVkY01g-HdMSVosZHtij3F9rGO3YMXOxcdEJcpKLr0FjL02MUpDI_26kQ7Wmv6kwLqCcIYQJp3AUeZyeBCqjAwZDtubAzK2DtSvV4qQZafzphHuuqrnvvS5sFKQdjT5o78-RqiN4tTNbZVkWfV7RTWJOb34OlUp256ABGxOCdr1bx7gZaheCi-272Yczeg2o-EnrXBuqoZT3e8vanNYx1RJRR29xZJ2FNXLZrNMj8YTZ85TUTqaeOidT8Xm-Y2ZocvK3PJfZ9R5pvAocSnRA";

  it('should return 401 when missing authorization header', async () => {
    const req = mockHttpRequest(`/some-parameters`);
    const [res] = mockHttpResponse();
    const next = jest.fn();

    const mockAuthentication = new MockAuthentication([{
      offer: 'UNKNOWN',
      market: 'FA'
    }], 'cutting-room-parameters.dev.mylectra.com');
    await new AuthenticationMiddleware(mockAuthentication).check(req, res, next);

    expect(res.statusCode).toEqual(401);
    expect(res._getData().message).toEqual('Missing Authorization header');
    expect(next.mock.calls.length).toEqual(0);
  });

  it('should return 401 when user authorizations does not contains almost an authorized offer', async () => {
    const req = mockHttpRequest(`/some-parameters`);
    req.headers = {...req.headers, authorization: authorization};
    const [res] = mockHttpResponse();
    const next = jest.fn();

    const mockAuthentication = new MockAuthentication([{
      offer: 'UNKNOWN',
      market: 'FA'
    }], 'cutting-room-parameters.dev.mylectra.com');
    await new AuthenticationMiddleware(mockAuthentication).check(req, res, next);

    expect(res.statusCode).toEqual(401);
    expect(res._getData().message).toEqual('Access denied: insufficient authorizations');
    expect(next.mock.calls.length).toEqual(0);
  });

  it('should call next when offer OD', async () => {
    const req = mockHttpRequest(`/some-parameters`);
    req.headers = {...req.headers, authorization: authorization};
    const [res] = mockHttpResponse();
    const next = jest.fn();

    const mockAuthentication = new MockAuthentication([{
      offer: 'OD',
      market: 'FA'
    }], 'cutting-room-parameters.dev.mylectra.com');
    await new AuthenticationMiddleware(mockAuthentication).check(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(next.mock.calls.length).toEqual(1);
  });

  it('should call next when offer MTO', async () => {
    const req = mockHttpRequest(`/some-parameters`);
    req.headers = {...req.headers, authorization: authorization};
    const [res] = mockHttpResponse();
    const next = jest.fn();

    const mockAuthentication = new MockAuthentication([{
      offer: 'MTO',
      market: 'FA'
    }], 'cutting-room-parameters.dev.mylectra.com');
    await new AuthenticationMiddleware(mockAuthentication).check(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(next.mock.calls.length).toEqual(1);
  });

  it('should call next when offer MTC', async () => {
    const req = mockHttpRequest(`/some-parameters`);
    req.headers = {...req.headers, authorization: authorization};
    const [res] = mockHttpResponse();
    const next = jest.fn();

    const mockAuthentication = new MockAuthentication([{
      offer: 'MTC',
      market: 'FA'
    }], 'cutting-room-parameters.dev.mylectra.com');
    await new AuthenticationMiddleware(mockAuthentication).check(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(next.mock.calls.length).toEqual(1);
  });

  it('should call next when offer MTM', async () => {
    const req = mockHttpRequest(`/some-parameters`);
    req.headers = {...req.headers, authorization: authorization};
    const [res] = mockHttpResponse();
    const next = jest.fn();

    const mockAuthentication = new MockAuthentication([{
      offer: 'MTM',
      market: 'FA'
    }], 'cutting-room-parameters.dev.mylectra.com');
    await new AuthenticationMiddleware(mockAuthentication).check(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(next.mock.calls.length).toEqual(1);
  });

  class MockAuthentication implements Authentication {
    private readonly principal: Principal;
    private readonly config: AuthenticationConfig;

    constructor(authorizations: Authorization[], authDomain: string) {
      this.principal = new Principal('userId', 'tenantId', 'userLocale', authorizations)
      this.config = {
        audience: 'audience',
        clientId: 'clientId',
        domain: `${authDomain}`
      };
    }

    async authenticate(token: AccessToken): Promise<Principal | AuthenticationFailure> {
      return this.principal;
    }

    getConfig(): AuthenticationConfig {
      return this.config
    }
  }
});