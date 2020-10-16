import React, { useState, useEffect, useContext, ReactNode } from 'react';
import querystring from 'query-string';
import LectraLocale from 'lectra-locale';

import { AuthenticationContext } from './Authentication';

interface UserPreference {
  lectraLocale: LectraLocale;
}

const DEFAULT_USER_PREFERENCE: UserPreference = { lectraLocale: new LectraLocale() };
const UserPreferenceContext = React.createContext<UserPreference>(DEFAULT_USER_PREFERENCE);

const UserPreferenceProvider = (props: { children: ReactNode }) => {
  const authenticationContext = useContext(AuthenticationContext);
  const [userPreference, setUserPreference] = useState<UserPreference>(DEFAULT_USER_PREFERENCE);
  const [provider, setProvider] = useState<string>('default');

  const auth0Locale = authenticationContext.user()['https://metadata.lectra.com/user_metadata']?.locale || 'en';
  const lectraLocaleCode = querystring.parse(window.location.search)['lectra-locale'] as string;

  useEffect(() => {
    if (lectraLocaleCode) {
      const lectraLocale = lectraLocaleCode ? lectraLocaleCode : auth0Locale;
      setUserPreference({ lectraLocale: LectraLocale.fromLocale(lectraLocale) });
      setProvider('lectra');
    } else if (provider !== 'lectra') {
      setUserPreference({ lectraLocale: LectraLocale.fromLocale(auth0Locale) });
      setProvider('auth0');
    }
  }, [auth0Locale, lectraLocaleCode, provider]);

  return <UserPreferenceContext.Provider value={userPreference}>{props.children}</UserPreferenceContext.Provider>;
};

export default UserPreferenceProvider;
export { UserPreferenceContext };
