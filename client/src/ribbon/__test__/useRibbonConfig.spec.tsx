import 'jest';
import React, { ReactNode } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl';

import useRibbonConfig from '../useRibbonConfig';
import { UIStateContext } from '../../UIState';

describe('useRibbonConfig', () => {
  it('ribbon should render default ribbon config', () => {
    const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
      <IntlProvider
        locale="en"
        messages={{
          'group.edit': 'Edit',
          'group.save': 'Save',
          'command.save': 'Save',
          'command.cancel': 'Cancel',
          'command.edit': 'Edit'
        }}
      >
        <UIStateContext.Provider value={[{ editMode: false }, () => {}]}>{children}</UIStateContext.Provider>
      </IntlProvider>
    );
    const { result } = renderHook(() => useRibbonConfig(), { wrapper: Wrapper });

    const config = result.current;

    expect(config.groups.length).toEqual(1);
    expect(config.groups[0].description).toEqual('Edit');
    expect(config.groups[0].commands.length).toEqual(1);
    expect(config.groups[0].commands[0].description).toEqual('Edit');
    expect(config.groups[0].commands[0].enable).toBeTruthy();
  });

  it('ribbon should render edit ribbon config', () => {
    const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
      <IntlProvider
        locale="en"
        messages={{
          'group.edit': 'Edit',
          'group.save': 'Save',
          'command.save': 'Save',
          'command.cancel': 'Cancel',
          'command.edit': 'Edit'
        }}
      >
        <UIStateContext.Provider value={[{ editMode: true }, () => {}]}>{children}</UIStateContext.Provider>
      </IntlProvider>
    );
    const { result } = renderHook(() => useRibbonConfig(), { wrapper: Wrapper });

    const config = result.current;

    expect(config.groups.length).toEqual(1);
    expect(config.groups[0].description).toEqual('Save');
    expect(config.groups[0].commands.length).toEqual(2);
    expect(config.groups[0].commands[0].description).toEqual('Save');
    expect(config.groups[0].commands[0].enable).toBeTruthy();
    expect(config.groups[0].commands[1].description).toEqual('Cancel');
    expect(config.groups[0].commands[1].enable).toBeTruthy();
  });
});
