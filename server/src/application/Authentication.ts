import { getNamespace } from 'cls-hooked';
import { AccessToken, AuthenticationConfig, Principal, AuthenticationFailure } from 'lectra-auth-nodejs';

export interface Authentication {
  authenticate(token: AccessToken): Promise<Principal | AuthenticationFailure>;
  getConfig(): AuthenticationConfig
}

export function currentPrincipal(): Principal {
  const current = currentPrincipalOrNull();
  if (!current) throw new Error('No principal in auth namespace !');
  return current;
}

export function currentPrincipalOrNull(): Principal | null {
  const current = getNamespace(AUTH_NAMESPACE)?.get('principal');
  if (current) {
    return current as Principal;
  } else return null;
}

export const AUTH_NAMESPACE = 'auth_namespace';
