import React, { useState, useEffect, useContext, ReactNode } from 'react';
import querystring from 'query-string';
import LectraLocale from 'lectra-locale';
import { UnitSystem } from 'cutting-room-units';

import { AuthenticationContext } from './Authentication';

interface UserPreference {
  lectraLocale: LectraLocale;
  unitSystem: UnitSystem;
}

const DEFAULT_USER_PREFERENCE: UserPreference = { lectraLocale: new LectraLocale(), unitSystem: 'metric' };
const UserPreferenceContext = React.createContext<UserPreference>(DEFAULT_USER_PREFERENCE);

const UserPreferenceProvider = (props: { children: ReactNode }) => {
  const authenticationContext = useContext(AuthenticationContext);
  const [userPreference, setUserPreference] = useState<UserPreference>(DEFAULT_USER_PREFERENCE);
  const [provider, setProvider] = useState<string>('default');

  const auth0Locale = authenticationContext.user()['https://metadata.lectra.com/user_metadata']?.locale || 'en';
  const lectraLocaleCode = querystring.parse(window.location.search)['lectra-locale'] as string;
  const unitSystemCode = querystring.parse(window.location.search)['unit-system'] as string;

  useEffect(() => {
    if (lectraLocaleCode || unitSystemCode) {
      const lectraLocale = lectraLocaleCode ? new LectraLocale(lectraLocaleCode) : LectraLocale.fromLocale(auth0Locale);
      const unitSystem = unitSystemCode ? (unitSystemCode === 'imperial' ? 'imperial' : 'metric') : 'metric';
      setUserPreference({ lectraLocale, unitSystem });
      setProvider('lectra');
    } else if (provider !== 'lectra') {
      setUserPreference({ lectraLocale: LectraLocale.fromLocale(auth0Locale), unitSystem: 'metric' });
      setProvider('auth0');
    }
  }, [auth0Locale, lectraLocaleCode, provider, unitSystemCode]);

  return <UserPreferenceContext.Provider value={userPreference}>{props.children}</UserPreferenceContext.Provider>;
};

export const useUnitSystem = () => {
  return useContext(UserPreferenceContext).unitSystem;
};

export default UserPreferenceProvider;
export { UserPreferenceContext };
