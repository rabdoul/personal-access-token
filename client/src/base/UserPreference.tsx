import React, { useState, useEffect, useContext, ReactNode } from 'react';
import querystring from 'query-string';
import LectraLocale from 'lectra-locale';
import { UnitSystem } from 'cutting-room-units';

import { AuthenticationContext } from './Authentication';

interface UserPreference {
  locale: string;
  unitSystem: UnitSystem;
}

const DEFAULT_USER_PREFERENCE: UserPreference = { locale: 'en-us', unitSystem: 'metric' };
const UserPreferenceContext = React.createContext<UserPreference>(DEFAULT_USER_PREFERENCE);

const UserPreferenceProvider = (props: { children: ReactNode }) => {
  const authenticationContext = useContext(AuthenticationContext);
  const [userPreference, setUserPreference] = useState<UserPreference>(DEFAULT_USER_PREFERENCE);
  const [provider, setProvider] = useState<string>('default');

  const auth0Locale = authenticationContext.user()['https://metadata.lectra.com/user_metadata']?.locale || 'en-US';
  const lectraLocaleCode = querystring.parse(window.location.search)['lectra-locale'] as string;
  const locale = querystring.parse(window.location.search)['locale'] as string;
  const unitSystemCodeParam = querystring.parse(window.location.search)['unit-system'] as string;

  let usedLocale: string | undefined;
  if (locale) {
    usedLocale = locale;
  } else if (lectraLocaleCode) {
    usedLocale = LectraLocale.from(lectraLocaleCode).isoCode();
  }

  useEffect(() => {
    if (usedLocale || unitSystemCodeParam) {
      const unitSystem = unitSystemCodeParam ? (unitSystemCodeParam === 'imperial' ? 'imperial' : 'metric') : 'metric';
      setUserPreference({ locale: usedLocale !== undefined ? usedLocale : '', unitSystem });
      setProvider('lectra');
    } else if (provider !== 'lectra') {
      setUserPreference({ locale: auth0Locale, unitSystem: 'metric' });
      setProvider('auth0');
    }
  }, [auth0Locale, usedLocale, provider, unitSystemCodeParam]);

  return <UserPreferenceContext.Provider value={userPreference}>{props.children}</UserPreferenceContext.Provider>;
};

export const useUnitSystem = () => {
  return useContext(UserPreferenceContext).unitSystem;
};

export default UserPreferenceProvider;
export { UserPreferenceContext };
