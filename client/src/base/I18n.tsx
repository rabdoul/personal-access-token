import { ReactNode, useContext } from 'react';
import { IntlProvider } from 'react-intl';

import { UserPreferenceContext } from './UserPreference';

const i18n = require('../generated/i18n.json');

const I18nProvider = (props: { children: ReactNode }) => {
  const { locale } = useContext(UserPreferenceContext);
  const usedLocale = i18n.hasOwnProperty(locale) ? locale : 'en-us';
  return (
    <IntlProvider locale={usedLocale} messages={i18n[usedLocale]} onError={() => {}}>
      {props.children}
    </IntlProvider>
  );
};

export default I18nProvider;
