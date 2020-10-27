import React from 'react';
import { IntlProvider } from 'react-intl';
import LectraLocale from 'lectra-locale';
import { AuthenticationContext } from '../../../base/Authentication';
import { UserPreferenceContext } from '../../../base/UserPreference';
import { renderHook } from '@testing-library/react-hooks';
import useConditionConfiguration from '../useConditionConfiguration';
import { ActivityConfiguration, Condition } from '../../../model';
import { mocked } from 'ts-jest/utils';
import { QueryResult, useQuery } from 'react-query';

jest.mock('react-query');

const MockedProviders = ({ children, unitSystem }: { children: any; unitSystem: 'metric' | 'imperial' }) => (
  <AuthenticationContext.Provider value={{ accessToken: () => 'token', idToken: () => '', user: () => ({}), isSupportMode: () => false }}>
    <IntlProvider locale="en" messages={{}} onError={() => {}}>
      <UserPreferenceContext.Provider value={{ lectraLocale: LectraLocale.fromLocale('en'), unitSystem }}>{children}</UserPreferenceContext.Provider>
    </IntlProvider>
  </AuthenticationContext.Provider>
);

describe('useConditionConfiguration', () => {
  it('should return a default condition configuration', () => {
    const condition: Condition = { reference: 'command.reference' };
    const configuration: ActivityConfiguration = {
      id: 'validate-marker',
      conditions: [{ reference: 'command.reference', multipleOperators: [], operators: [], predefinedValueSource: [], valueSource: 'None', valueType: 'String' }]
    };
    mocked(useQuery).mockReturnValue({ data: {}, isSuccess: true } as QueryResult<any, any>);

    const { result } = renderHook(() => useConditionConfiguration(condition, configuration), {
      wrapper: ({ children }) => <MockedProviders unitSystem={'metric'}>{children}</MockedProviders>
    });

    expect(result.current).toEqual({
      listItems: [],
      operators: [],
      references: [
        {
          label: 'command.reference',
          value: 'command.reference'
        }
      ],
      type: 'text'
    });
  });

  it('should return a condition configuration with unit in metric', () => {
    const condition: Condition = { reference: 'marker.length' };
    const configuration: ActivityConfiguration = {
      id: 'validate-marker',
      conditions: [
        {
          reference: 'marker.length',
          multipleOperators: [],
          operators: [],
          predefinedValueSource: [],
          valueSource: 'None',
          valueType: 'String',
          valueUnit: { metric: { decimalScale: 3, unit: 'm' }, imperial: { decimalScale: 3, unit: 'yd' } }
        }
      ]
    };
    mocked(useQuery).mockReturnValue({ data: {}, isSuccess: true } as QueryResult<any, any>);

    const { result } = renderHook(() => useConditionConfiguration(condition, configuration), {
      wrapper: ({ children }) => <MockedProviders unitSystem={'metric'}>{children}</MockedProviders>
    });

    expect(result.current.unitConfig).toEqual({ decimalScale: 3, unit: 'm' });
  });

  it('should return a condition configuration with unit in imperial', () => {
    const condition: Condition = { reference: 'marker.length' };
    const configuration: ActivityConfiguration = {
      id: 'validate-marker',
      conditions: [
        {
          reference: 'marker.length',
          multipleOperators: [],
          operators: [],
          predefinedValueSource: [],
          valueSource: 'None',
          valueType: 'String',
          valueUnit: { metric: { decimalScale: 3, unit: 'm' }, imperial: { decimalScale: 3, unit: 'yd' } }
        }
      ]
    };
    mocked(useQuery).mockReturnValue({ data: {}, isSuccess: true } as QueryResult<any, any>);

    const { result } = renderHook(() => useConditionConfiguration(condition, configuration), {
      wrapper: ({ children }) => <MockedProviders unitSystem={'imperial'}>{children}</MockedProviders>
    });

    expect(result.current.unitConfig).toEqual({ decimalScale: 3, unit: 'yd' });
  });
});
