import React, { ReactNode, useContext, useEffect, useState } from 'react';
import LectraAuth from 'lectra-auth-js';

import LoadingScreen from './LoadingScreen';

export type AuthConfig = {
  authDomain: string;
  clientId: string;
  audience: string;
  baseUrl: string;
  callbackUrl?: string;
  silentCallbackUrl?: string;
  scopes?: string;
};

type User = { [k: string]: any };

interface AuthContext {
  accessToken: () => string;
  idToken: () => string;
  user: () => User;
  isSupportMode: () => boolean;
}

export class AuthenticatedUserContext implements AuthContext {
  accessToken: () => string;
  idToken: () => string;
  user: () => User;
  isSupportMode: () => boolean;

  constructor(accessToken: string, idToken: string, user: User) {
    this.accessToken = () => accessToken;
    this.idToken = () => idToken;
    this.user = () => user;
    this.isSupportMode = () => user['https://metadata.lectra.com/app_metadata']?.account_type === 'SUPPORT';
  }
}

const UNAUTHENTICATED_USER_CONTEXT = {
  accessToken: () => {
    throw new Error('Unauthenticated user');
  },
  idToken: () => {
    throw new Error('Unauthenticated user');
  },
  user: () => {
    throw new Error('Unauthenticated user');
  },
  isSupportMode: () => false
};

const LOCAL_AUTHENTICATION_CONTEXT = new AuthenticatedUserContext(process.env.REACT_APP_ACCESS_TOKEN!, '', {
  sub: 'auth0|666',
  'https://metadata.lectra.com/app_metadata': {
    account_type: 'SUPPORT_OR_NOT',
    authorizations: [{ offer: 'OD', market: 'FA' }],
    company: { id: '123456789_A' }
  }
});

function isGrantedAuthorisation(authorization: { offer: string }, index: number, array: { offer: string }[]) {
  return ['OD', 'MTO', 'MTC', 'MTM'].includes(authorization.offer);
}

export function isGrantedUser(user: User) {
  const userAuthorizations: { offer: string }[] = user['https://metadata.lectra.com/app_metadata'].authorizations;
  return userAuthorizations.some(isGrantedAuthorisation);
}

export const AuthenticationContext = React.createContext<AuthContext>(UNAUTHENTICATED_USER_CONTEXT);

async function authenticate(authConfig: AuthConfig): Promise<AuthContext | undefined> {
  const authenticationService = new LectraAuth({ ...authConfig, callbackUrl: '/' });
  try {
    const tokens: { idToken: string; accessToken: string } = await authenticationService.checkSSO();

    const user = authenticationService.decodeToken(tokens.idToken);

    if (!isGrantedUser(user)) {
      throw new Error('Access denied');
    }

    return new AuthenticatedUserContext(tokens.accessToken, tokens.idToken, user);
  } catch (error) {
    authenticationService.redirectToLogin();
  }
}

const AuthenticationProvider: React.FC<{ authConfig?: AuthConfig; children: ReactNode }> = ({ authConfig, children }) => {
  const [authenticationContext, setAuthenticationContext] = useState<AuthContext>(UNAUTHENTICATED_USER_CONTEXT);
  useEffect(() => {
    if (authConfig?.authDomain) {
      if (authConfig.authDomain !== 'localhost') {
        authenticate(authConfig).then(ctx => {
          if (ctx) setAuthenticationContext(ctx);
        });
      } else {
        setAuthenticationContext(LOCAL_AUTHENTICATION_CONTEXT);
      }
    }
  }, [authConfig]);

  return (
    <AuthenticationContext.Provider value={authenticationContext}>
      {authenticationContext !== UNAUTHENTICATED_USER_CONTEXT ? children : <LoadingScreen />}
    </AuthenticationContext.Provider>
  );
};

export function useAccessToken() {
  return useContext(AuthenticationContext).accessToken();
}

export function useAuthConfig(): AuthConfig | undefined {
  const [config, setConfig] = useState<AuthConfig>();

  useEffect(() => {
    (async () => {
      const res = await fetch('/authentication-config');
      const config = await res.json();
      const configAuth0 = {
        authDomain: config.domain,
        clientId: config.clientId,
        baseUrl: window.origin,
        audience: config.audience
      };
      setConfig(configAuth0);
    })();
  }, []);

  return config;
}

export default AuthenticationProvider;
