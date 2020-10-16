import React, { ReactNode, useContext } from 'react';
import { IntlProvider } from 'react-intl';

import { UserPreferenceContext } from './UserPreference';

const i18n = require('../generated/i18n.json');

const I18nProvider = (props: { children: ReactNode }) => {
  const userPreferenceContext = useContext(UserPreferenceContext);
  const lectraLocale = userPreferenceContext.lectraLocale;
  const lectraLocaleCode = i18n.hasOwnProperty(lectraLocale.code.toLocaleLowerCase()) ? lectraLocale.code : 'en';
  const messages = i18n[lectraLocaleCode.toLocaleLowerCase()];
  return (
    <IntlProvider locale={lectraLocale.toLocale()} messages={messages} onError={() => {}}>
      {props.children}
    </IntlProvider>
  );
};

export default I18nProvider;
