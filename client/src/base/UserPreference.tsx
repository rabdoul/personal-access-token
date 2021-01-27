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

  const localeParam = querystring.parse(window.location.search)['locale'] as string;
  const lectraLocaleCodeParam = querystring.parse(window.location.search)['lectra-locale'] as string;
  const auth0Locale = authenticationContext.user()['https://metadata.lectra.com/user_metadata']?.locale || 'en-us';
  const unitSystemCodeParam = querystring.parse(window.location.search)['unit-system'] as string;

  useEffect(() => {
    if (lectraLocaleCodeParam || localeParam || unitSystemCodeParam) {
      let locale = 'en-us';
      if (localeParam) {
        locale = localeParam;
      } else if (lectraLocaleCodeParam) {
        locale = new LectraLocale(lectraLocaleCodeParam).toLocale();
      }
      const unitSystem = unitSystemCodeParam ? (unitSystemCodeParam === 'imperial' ? 'imperial' : 'metric') : 'metric';
      setUserPreference({ locale: locale.toLocaleLowerCase(), unitSystem });
      setProvider('lectra');
    } else if (provider !== 'lectra') {
      setUserPreference({ locale: auth0Locale.toLowerCase(), unitSystem: 'metric' });
      setProvider('auth0');
    }
  }, [auth0Locale, lectraLocaleCodeParam, localeParam, provider, unitSystemCodeParam]);

  return <UserPreferenceContext.Provider value={userPreference}>{props.children}</UserPreferenceContext.Provider>;
};

export const useUnitSystem = () => {
  return useContext(UserPreferenceContext).unitSystem;
};

export default UserPreferenceProvider;
export { UserPreferenceContext };
