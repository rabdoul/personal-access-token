import 'jest';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl';

import useRibbonConfig from '../useRibbonConfig';
import { UIStateContext } from '../../UIState';
import { AuthenticationContext, AuthenticatedUserContext } from '../../base/Authentication';

const aliases = {
  PP_EDIT: 'http://help.dev.mylectra.com/PP_EDIT',
  PP_SAVE: 'http://help.dev.mylectra.com/PP_SAVE',
  PP_CANCEL: 'http://help.dev.mylectra.com/PP_CANCEL'
};

const i18nMessages = {
  'group.edit': 'Edit',
  'group.save': 'Save',
  'command.save': 'Save',
  'command.cancel': 'Cancel',
  'command.edit': 'Edit'
};

const buildAuthContext = (accountType: string) => new AuthenticatedUserContext('', '', { 'https://metadata.lectra.com/app_metadata': { account_type: accountType } });

const MockedProviders = ({ uiStateContext, children, accountType }: { uiStateContext: any; children: any; accountType: string }) => (
  <AuthenticationContext.Provider value={buildAuthContext(accountType)}>
    <IntlProvider locale="en" messages={i18nMessages}>
      <UIStateContext.Provider value={uiStateContext}>{children}</UIStateContext.Provider>
    </IntlProvider>
  </AuthenticationContext.Provider>
);

describe('useRibbonConfig', () => {
  it('ribbon should render default ribbon config', () => {
    const { result } = renderHook(() => useRibbonConfig(aliases), {
      wrapper: ({ children }) => (
        <MockedProviders accountType="USER" uiStateContext={[{ editMode: false }, () => {}]}>
          {children}
        </MockedProviders>
      )
    });

    const config = result.current;

    expect(config.groups.length).toEqual(1);
    expect(config.groups[0].description).toEqual('Edit');
    expect(config.groups[0].commands.length).toEqual(1);
    expect(config.groups[0].commands[0].description).toEqual('Edit');
    expect(config.groups[0].commands[0].enable).toBeTruthy();
    expect(config.groups[0].commands[0].helpUrl).toBe('http://help.dev.mylectra.com/PP_EDIT');
  });

  it('ribbon should render edit ribbon config with save enabled', () => {
    const { result } = renderHook(() => useRibbonConfig(aliases), {
      wrapper: ({ children }) => (
        <MockedProviders accountType="USER" uiStateContext={[{ editMode: true, invalidRules: new Set() }, () => {}]}>
          {children}
        </MockedProviders>
      )
    });

    const config = result.current;

    expect(config.groups.length).toEqual(1);
    expect(config.groups[0].description).toEqual('Save');
    expect(config.groups[0].commands.length).toEqual(2);
    expect(config.groups[0].commands[0].description).toEqual('Save');
    expect(config.groups[0].commands[0].enable).toBeTruthy();
    expect(config.groups[0].commands[0].helpUrl).toBe('http://help.dev.mylectra.com/PP_SAVE');

    expect(config.groups[0].commands[1].description).toEqual('Cancel');
    expect(config.groups[0].commands[1].enable).toBeTruthy();
    expect(config.groups[0].commands[1].helpUrl).toBe('http://help.dev.mylectra.com/PP_CANCEL');
  });

  it('ribbon should render edit ribbon config with save disabled when error', () => {
    const { result } = renderHook(() => useRibbonConfig(aliases), {
      wrapper: ({ children }) => (
        <MockedProviders accountType="USER" uiStateContext={[{ editMode: true, invalidRules: { 'setup-sequencing': new Set(['numberOfProductOrders']) } }, () => {}]}>
          {children}
        </MockedProviders>
      )
    });

    const config = result.current;

    expect(config.groups.length).toEqual(1);
    expect(config.groups[0].description).toEqual('Save');
    expect(config.groups[0].commands.length).toEqual(2);
    expect(config.groups[0].commands[0].description).toEqual('Save');
    expect(config.groups[0].commands[0].enable).toBeFalsy();
    expect(config.groups[0].commands[0].helpUrl).toBe('http://help.dev.mylectra.com/PP_SAVE');

    expect(config.groups[0].commands[1].description).toEqual('Cancel');
    expect(config.groups[0].commands[1].enable).toBeTruthy();
    expect(config.groups[0].commands[1].helpUrl).toBe('http://help.dev.mylectra.com/PP_CANCEL');
  });

  it('ribbon should render edit ribbon config with save disabled when mode support', () => {
    const { result } = renderHook(() => useRibbonConfig(aliases), {
      wrapper: ({ children }) => (
        <MockedProviders accountType="SUPPORT" uiStateContext={[{ editMode: true, invalidRules: new Set() }, () => {}]}>
          {children}
        </MockedProviders>
      )
    });

    const config = result.current;

    expect(config.groups.length).toEqual(1);
    expect(config.groups[0].description).toEqual('Save');
    expect(config.groups[0].commands.length).toEqual(2);
    expect(config.groups[0].commands[0].description).toEqual('Save');
    expect(config.groups[0].commands[0].enable).toBeFalsy();
    expect(config.groups[0].commands[0].helpUrl).toBe('http://help.dev.mylectra.com/PP_SAVE');

    expect(config.groups[0].commands[1].description).toEqual('Cancel');
    expect(config.groups[0].commands[1].enable).toBeTruthy();
    expect(config.groups[0].commands[1].helpUrl).toBe('http://help.dev.mylectra.com/PP_CANCEL');
  });
});
