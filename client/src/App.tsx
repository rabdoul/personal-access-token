import React from 'react';
import { ThemeProvider } from 'styled-components';
import Theme from '@lectra/themes';
import { BrowserRouter as Router } from 'react-router-dom';

import AuthenticationProvider, { useAuthConfig } from './base/Authentication';
import FeatureFlippingProvider from './base/FeatureFlipping';
import HelpProvider from './base/Help';
import I18nProvider from './base/I18n';
import UserPreferenceProvider from './base/UserPreference';
import ProductionProcessScreen from './ProductionProcessScreen';

import './App.scss';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <AuthenticationProvider authConfig={useAuthConfig()}>
        <UserPreferenceProvider>
          <FeatureFlippingProvider>
            <I18nProvider>
              <HelpProvider>
                <Router>
                  <ProductionProcessScreen />
                </Router>
              </HelpProvider>
            </I18nProvider>
          </FeatureFlippingProvider>
        </UserPreferenceProvider>
      </AuthenticationProvider>
    </ThemeProvider>
  );
}

export default App;
