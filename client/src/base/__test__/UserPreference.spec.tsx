import React, { useContext } from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { AuthenticationContext } from '../Authentication';
import UserPreferenceProvider, { UserPreferenceContext } from '../UserPreference';

describe('UserPreference', () => {
  const StaticAuthenticationProvider = (props: { locale: string; children: any }) => (
    <AuthenticationContext.Provider
      value={{
        accessToken: () => 'token',
        idToken: () => '',
        user: () => ({ 'https://metadata.lectra.com/user_metadata': { locale: props.locale } }),
        isSupportMode: () => false
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );

  it('should init locale from auth0', async () => {
    const wrapper: React.FC = ({ children }) => (
      <StaticAuthenticationProvider locale="fr-fr">
        <UserPreferenceProvider>{children}</UserPreferenceProvider>
      </StaticAuthenticationProvider>
    );
    const { result } = renderHook(() => useContext(UserPreferenceContext), { wrapper });

    expect(result.current.locale).toEqual('fr-fr');
  });

  it('should init locale from lectra locale', async () => {
    Object.defineProperty(window, 'location', { value: { search: '?lectra-locale=de' }, writable: true });

    const wrapper: React.FC = ({ children }) => (
      <StaticAuthenticationProvider locale="fr-fr">
        <UserPreferenceProvider>{children}</UserPreferenceProvider>
      </StaticAuthenticationProvider>
    );

    const { result } = renderHook(() => useContext(UserPreferenceContext), { wrapper });
    expect(result.current.locale).toEqual('de-DE');
  });

  it('should init locale from locale', async () => {
    Object.defineProperty(window, 'location', { value: { search: '?locale=it-it' }, writable: true });

    const wrapper: React.FC = ({ children }) => (
      <StaticAuthenticationProvider locale="fr-fr">
        <UserPreferenceProvider>{children}</UserPreferenceProvider>
      </StaticAuthenticationProvider>
    );

    const { result } = renderHook(() => useContext(UserPreferenceContext), { wrapper });
    expect(result.current.locale).toEqual('it-it');
  });

  it('should privilege locale', async () => {
    Object.defineProperty(window, 'location', { value: { search: '?locale=it-it&lectra-locale=de-de' }, writable: true });

    const wrapper: React.FC = ({ children }) => (
      <StaticAuthenticationProvider locale="fr-fr">
        <UserPreferenceProvider>{children}</UserPreferenceProvider>
      </StaticAuthenticationProvider>
    );

    const { result } = renderHook(() => useContext(UserPreferenceContext), { wrapper });
    expect(result.current.locale).toEqual('it-it');
  });

  it('should init default unit system', async () => {
    const wrapper: React.FC = ({ children }) => (
      <StaticAuthenticationProvider locale="fr-fr">
        <UserPreferenceProvider>{children}</UserPreferenceProvider>
      </StaticAuthenticationProvider>
    );
    const { result } = renderHook(() => useContext(UserPreferenceContext), { wrapper });

    expect(result.current.unitSystem).toEqual('metric');
  });

  it('should init unit system from query param', async () => {
    Object.defineProperty(window, 'location', { value: { search: '?unit-system=imperial' }, writable: true });
    const wrapper: React.FC = ({ children }) => (
      <StaticAuthenticationProvider locale="fr-fr">
        <UserPreferenceProvider>{children}</UserPreferenceProvider>
      </StaticAuthenticationProvider>
    );
    const { result } = renderHook(() => useContext(UserPreferenceContext), { wrapper });

    expect(result.current.unitSystem).toEqual('imperial');
  });
});
