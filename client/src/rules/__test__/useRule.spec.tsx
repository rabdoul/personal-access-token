import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useQuery, QueryResult } from 'react-query';
import { mocked } from 'ts-jest/utils';

import { AuthenticationContext } from '../../base/Authentication';
import { Sequencing } from '../../model';
import { UIStateContext } from '../../UIState';
import useRule from '../useRule';

jest.mock('react-query');

const MockedProviders = ({ uiStateContext, children }: { uiStateContext: any; children: any }) => (
  <AuthenticationContext.Provider value={{ accessToken: () => 'token', idToken: () => '', user: () => ({}) }}>
    <UIStateContext.Provider value={uiStateContext}>{children}</UIStateContext.Provider>
  </AuthenticationContext.Provider>
);

describe('useRule', () => {
  it('should not initialize form when it is loading', async () => {
    mocked(useQuery).mockReturnValue({ data: undefined, isSuccess: false } as QueryResult<any, any>);

    const { result } = renderHook(
      () => useRule<'setup-sequencing', Sequencing>('setup-sequencing', () => {}),
      { wrapper: ({ children }) => <MockedProviders uiStateContext={[{}, () => {}]}>{children}</MockedProviders> }
    );

    expect(result.current).toBeUndefined();
  });
});
