import React, { useState, useEffect, useContext, ReactNode } from 'react';
import querystring from 'query-string';
import LectraLocale from 'lectra-locale';

import { AuthenticationContext } from './Authentication';

interface UserPreference {
  lectraLocale: LectraLocale;
  isReadOnlyMode: boolean;
}

const DEFAULT_USER_PREFERENCE: UserPreference = { lectraLocale: new LectraLocale(), isReadOnlyMode: false };
const UserPreferenceContext = React.createContext<UserPreference>(DEFAULT_USER_PREFERENCE);

const UserPreferenceProvider = (props: { children: ReactNode }) => {
  const authenticationContext = useContext(AuthenticationContext);
  const [userPreference, setUserPreference] = useState<UserPreference>(DEFAULT_USER_PREFERENCE);
  const [provider, setProvider] = useState<string>('default');

  const auth0Locale = authenticationContext.user()['https://metadata.lectra.com/user_metadata']?.locale || 'en';
  const isReadOnlyMode = authenticationContext.user()['https://metadata.lectra.com/app_metadata']?.account_type === 'SUPPORT';
  const lectraLocaleCode = querystring.parse(window.location.search)['lectra-locale'] as string;

  useEffect(() => {
    if (lectraLocaleCode) {
      const lectraLocale = lectraLocaleCode ? new LectraLocale(lectraLocaleCode) : LectraLocale.fromLocale(auth0Locale);
      setUserPreference({ lectraLocale, isReadOnlyMode });
      setProvider('lectra');
    } else if (provider !== 'lectra') {
      setUserPreference({ lectraLocale: LectraLocale.fromLocale(auth0Locale), isReadOnlyMode });
      setProvider('auth0');
    }
  }, [auth0Locale, lectraLocaleCode, provider, isReadOnlyMode]);

  return <UserPreferenceContext.Provider value={userPreference}>{props.children}</UserPreferenceContext.Provider>;
};

export default UserPreferenceProvider;
export { UserPreferenceContext };
