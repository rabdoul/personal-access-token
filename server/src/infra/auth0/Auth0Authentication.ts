import { Authentication } from '../../application/Authentication';
import { CommandQueryExecutor, QueryResponseType } from '../../application/CommandQueryExecutor';
import { AUTH_AUDIENCE, AUTH_CLIENT_ID, AUTH_DOMAIN } from './auth0.config';
import {
  AuthenticationConfig,
  AuthenticationFailure,
  UserAuthenticationFlow,
  PublicKeyProvider,
  UserInfoProvider,
  AccessToken,
  ClientId,
  Principal,
  Kid
} from 'lectra-auth-nodejs';

export class Auth0Authentication implements Authentication {
  private readonly userAuthenticationFlow: UserAuthenticationFlow
  private readonly config: AuthenticationConfig

  constructor(commandQueryExecutor: CommandQueryExecutor) {
    this.config = {
      audience: AUTH_AUDIENCE!,
      clientId: AUTH_CLIENT_ID!,
      domain: `${AUTH_DOMAIN!}`
    };

    const publicKeyProvider: PublicKeyProvider = {
      async provide(kid: Kid) {
        const response = await commandQueryExecutor.executeQuery('authentication', { type: 'authentication.signing-certificate.query.get', parameters: { kid, withComment: true } });
        if (response.type === QueryResponseType.QUERY_FAILURE) {
          throw new Error('Unable to get public key from kid');
        } else {
          return (response.data! as any)
        }
      }
    };

    const userInfoProvider: UserInfoProvider = {
      async provide(accessToken: AccessToken, clientId: ClientId) {
        const response = await commandQueryExecutor.executeQuery('authentication', { type: 'authentication.user-info.query.get', parameters: { accessToken, clientId } });
        if (response.type === QueryResponseType.QUERY_FAILURE) {
          throw new Error('Unable to get user information from Client ID and Access Token');
        } else {
          return response.data
        }
      }
    };

    this.userAuthenticationFlow = new UserAuthenticationFlow(this.config, userInfoProvider, publicKeyProvider);
  }

  async authenticate(token: AccessToken): Promise<Principal | AuthenticationFailure> {
    return this.userAuthenticationFlow.verify(token);
  }

  getConfig(): AuthenticationConfig {
    return this.config
  }
}
