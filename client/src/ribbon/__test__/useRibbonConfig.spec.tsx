import 'jest';
import React, { ReactNode } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl';

import useRibbonConfig from '../useRibbonConfig';
import { UIStateContext } from '../../UIState';

const i18nMessages = {
  'group.edit': 'Edit',
  'group.save': 'Save',
  'command.save': 'Save',
  'command.cancel': 'Cancel',
  'command.edit': 'Edit'
};

const MockedProviders = ({ uiStateContext, children }: { uiStateContext: any; children: any }) => (
  <IntlProvider locale="en" messages={i18nMessages}>
    <UIStateContext.Provider value={uiStateContext}>{children}</UIStateContext.Provider>
  </IntlProvider>
);

describe('useRibbonConfig', () => {
  it('ribbon should render default ribbon config', () => {
    const { result } = renderHook(() => useRibbonConfig(), {
      wrapper: ({ children }) => <MockedProviders uiStateContext={[{ editMode: false }, () => {}]}>{children}</MockedProviders>
    });

    const config = result.current;

    expect(config.groups.length).toEqual(1);
    expect(config.groups[0].description).toEqual('Edit');
    expect(config.groups[0].commands.length).toEqual(1);
    expect(config.groups[0].commands[0].description).toEqual('Edit');
    expect(config.groups[0].commands[0].enable).toBeTruthy();
  });

  it('ribbon should render edit ribbon config with save enabled', () => {
    const { result } = renderHook(() => useRibbonConfig(), {
      wrapper: ({ children }) => <MockedProviders uiStateContext={[{ editMode: true, invalidRules: { 'setup-sequencing': new Set() } }, () => {}]}>{children}</MockedProviders>
    });

    const config = result.current;

    expect(config.groups.length).toEqual(1);
    expect(config.groups[0].description).toEqual('Save');
    expect(config.groups[0].commands.length).toEqual(2);
    expect(config.groups[0].commands[0].description).toEqual('Save');
    expect(config.groups[0].commands[0].enable).toBeTruthy();
    expect(config.groups[0].commands[1].description).toEqual('Cancel');
    expect(config.groups[0].commands[1].enable).toBeTruthy();
  });

  it('ribbon should render edit ribbon config with save disabled', () => {
    const { result } = renderHook(() => useRibbonConfig(), {
      wrapper: ({ children }) => (
        <MockedProviders uiStateContext={[{ editMode: true, invalidRules: { 'setup-sequencing': setOf('numberOfProductOrders') } }, () => {}]}>{children}</MockedProviders>
      )
    });

    const config = result.current;

    expect(config.groups.length).toEqual(1);
    expect(config.groups[0].description).toEqual('Save');
    expect(config.groups[0].commands.length).toEqual(2);
    expect(config.groups[0].commands[0].description).toEqual('Save');
    expect(config.groups[0].commands[0].enable).toBeFalsy();
    expect(config.groups[0].commands[1].description).toEqual('Cancel');
    expect(config.groups[0].commands[1].enable).toBeTruthy();
  });
});

function setOf(value: string) {
  const set = new Set();
  set.add(value);
  return set;
}
