import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useQuery, QueryResult } from 'react-query';
import { mocked } from 'ts-jest/utils';

import { AuthenticationContext } from '../../../base/Authentication';
import { UIStateContext } from '../../../UIState';
import useRule from '../useRule';

jest.mock('react-query');

const MockedProviders = ({ uiStateContext, children }: { uiStateContext: any; children: any }) => (
  <AuthenticationContext.Provider value={{ accessToken: () => 'token', idToken: () => '', user: () => ({}), isSupportMode: () => false }}>
    <UIStateContext.Provider value={uiStateContext}>{children}</UIStateContext.Provider>
  </AuthenticationContext.Provider>
);

describe('useRule', () => {
  it('should return undefined when query is still loading', async () => {
    mocked(useQuery).mockReturnValue({ data: undefined, isSuccess: false } as QueryResult<any, any>);

    const { result } = renderHook(() => useRule('setup-sequencing'), { wrapper: ({ children }) => <MockedProviders uiStateContext={[{}, () => {}]}>{children}</MockedProviders> });

    expect(result.current).toBeUndefined();
  });

  it('should return retrieved rule in display mode', async () => {
    mocked(useQuery).mockReturnValue({ data: { id: 'setup-sequencing' }, isSuccess: true } as QueryResult<any, any>);

    const { result } = renderHook(() => useRule('setup-sequencing'), { wrapper: ({ children }) => <MockedProviders uiStateContext={[{}, () => {}]}>{children}</MockedProviders> });

    expect(result.current).toEqual({ id: 'setup-sequencing' });
  });

  it('should initialize ui state in edit mode', async () => {
    mocked(useQuery).mockReturnValue({ data: { id: 'setup-sequencing' }, isSuccess: true } as QueryResult<any, any>);

    let state: any = { editMode: true, editedRules: new Set() };
    const { result } = renderHook(() => useRule('setup-sequencing'), {
      wrapper: ({ children }) => (
        <MockedProviders
          uiStateContext={[
            state,
            (action: any) => {
              state = { ...state, 'setup-sequencing': action.rule };
            }
          ]}
        >
          {children}
        </MockedProviders>
      )
    });

    expect(result.current).toEqual({ id: 'setup-sequencing' });
    expect(state).toEqual({ editMode: true, editedRules: new Set(), 'setup-sequencing': { id: 'setup-sequencing' } });
  });

  it('should return edited rule in edit mode', async () => {
    mocked(useQuery).mockReturnValue({ data: { id: 'setup-sequencing', numberOfProductOrders: 5 }, isSuccess: true } as QueryResult<any, any>);

    const state: any = { editMode: true, editedRules: new Set(), 'setup-sequencing': { id: 'setup-sequencing', numberOfProductOrders: 10 } };

    const { result } = renderHook(() => useRule('setup-sequencing'), {
      wrapper: ({ children }) => <MockedProviders uiStateContext={[state, () => {}]}>{children}</MockedProviders>
    });

    expect(result.current).toEqual({ id: 'setup-sequencing', numberOfProductOrders: 10 });
  });
});
