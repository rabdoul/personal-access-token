import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { UIStateContext } from '../../UIState';
import useRuleErrors from '../useRuleErrors';

const MockedProviders = ({ uiStateContext, children }: { uiStateContext: any; children: any }) => (
  <UIStateContext.Provider value={uiStateContext}>{children}</UIStateContext.Provider>
);

describe('useRuleErrors', () => {
  it('should return empty set if invalidRules is undefined', async () => {
    const { result } = renderHook(() => useRuleErrors('setup-sequencing'), {
      wrapper: ({ children }) => <MockedProviders uiStateContext={[{}, () => {}]}>{children}</MockedProviders>
    });

    expect(result.current.size).toBe(0);
  });

  it('should return empty set if invalidRules is not defined for the given activity', async () => {
    const { result } = renderHook(() => useRuleErrors('setup-sequencing'), {
      wrapper: ({ children }) => (
        <MockedProviders
          uiStateContext={[
            {
              invalidRules: { 'generate-batch': new Set(['numberOfProductOrders']) }
            },
            () => {}
          ]}
        >
          {children}
        </MockedProviders>
      )
    });

    expect(result.current.size).toBe(0);
  });

  it('should return invalid fields if invalidRules is defined for the given activity', async () => {
    const { result } = renderHook(() => useRuleErrors('setup-sequencing'), {
      wrapper: ({ children }) => (
        <MockedProviders
          uiStateContext={[
            {
              invalidRules: { 'setup-sequencing': new Set(['numberOfProductOrders']) }
            },
            () => {}
          ]}
        >
          {children}
        </MockedProviders>
      )
    });

    expect(result.current.size).toBe(1);
    expect(result.current.has('numberOfProductOrders')).toBeTruthy();
  });
});
