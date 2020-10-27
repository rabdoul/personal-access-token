import React from 'react';
import LectraLocale from 'lectra-locale';
import { renderHook } from '@testing-library/react-hooks';
import { AuthenticationContext } from '../../../base/Authentication';
import { UserPreferenceContext } from '../../../base/UserPreference';
import useValueUnit from '../useUnitConfig';

const MockedProviders = ({ children, unitSystem }: { children: any; unitSystem: 'metric' | 'imperial' }) => (
  <AuthenticationContext.Provider value={{ accessToken: () => 'token', idToken: () => '', user: () => ({}), isSupportMode: () => false }}>
    <UserPreferenceContext.Provider value={{ lectraLocale: LectraLocale.fromLocale('en'), unitSystem }}>{children}</UserPreferenceContext.Provider>
  </AuthenticationContext.Provider>
);

describe('useUnitConfig', () => {
  it('should throw error when unitType is unknown', () => {
    const { result } = renderHook(() => useValueUnit('MarkerWeight'), {
      wrapper: ({ children }) => <MockedProviders unitSystem={'metric'}>{children}</MockedProviders>
    });

    expect(result.error).toEqual(new Error('No unit defined for MarkerWeight'));
  });

  it('should return cm and 1 for unit type GroupsProcessing when unitSystem is metric', () => {
    const { result } = renderHook(() => useValueUnit('GroupsProcessing'), {
      wrapper: ({ children }) => <MockedProviders unitSystem={'metric'}>{children}</MockedProviders>
    });

    expect(result.current).toEqual({
      unit: 'cm',
      decimalScale: 1
    });
  });

  it('should return in and 2 for unit type GroupsProcessing when unitSystem is imperial', () => {
    const { result } = renderHook(() => useValueUnit('GroupsProcessing'), {
      wrapper: ({ children }) => <MockedProviders unitSystem={'imperial'}>{children}</MockedProviders>
    });

    expect(result.current).toEqual({
      unit: 'in',
      decimalScale: 2
    });
  });
});
