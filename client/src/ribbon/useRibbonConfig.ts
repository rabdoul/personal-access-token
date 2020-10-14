import { RibbonConfig } from '@lectra/embed-ribbon';
import produce from 'immer';
import { useContext } from 'react';
import { useIntl } from 'react-intl';

import { useUIState } from '../UIState';
import { AuthenticationContext } from '../base/Authentication';

const edit = `${window.origin}/assets/Edit_v01.png`;
const save = `${window.origin}/assets/Save_v01.png`;
const cancel = `${window.origin}/assets/Cancel.png`;

const displayConfig: RibbonConfig = {
  id: 'DISPLAY_PRODUCTION_PROCESS_CONFIG',
  groups: [
    {
      description: 'group.edit',
      commands: [
        {
          id: 'PP_EDIT',
          type: 'default',
          description: 'command.edit',
          imageUrl: edit,
          primary: true,
          enable: true,
          action: "document.dispatchEvent(new CustomEvent('RIBBON_ACTION', { 'detail': { 'action': 'EDIT_PRODUCTION_PROCESS' } }))"
        }
      ]
    }
  ]
};

const editConfig: RibbonConfig = {
  id: 'EDIT_PRODUCTION_PROCESS_CONFIG',
  groups: [
    {
      description: 'group.save',
      commands: [
        {
          id: 'PP_SAVE',
          type: 'default',
          description: 'command.save',
          imageUrl: save,
          primary: true,
          enable: true,
          action: "document.dispatchEvent(new CustomEvent('RIBBON_ACTION', { 'detail': { 'action': 'SAVE_PRODUCTION_PROCESS' } }))"
        },
        {
          id: 'PP_CANCEL',
          type: 'default',
          description: 'command.cancel',
          imageUrl: cancel,
          primary: true,
          enable: true,
          action: "document.dispatchEvent(new CustomEvent('RIBBON_ACTION', { 'detail': { 'action': 'CANCEL_PRODUCTION_PROCESS_EDITION' } }))"
        }
      ]
    }
  ]
};

function useRibbonConfig(aliases: Record<string, string>) {
  const { formatMessage } = useIntl();
  const { editMode, invalidRules } = useUIState();
  const isReadOnlyMode = useContext(AuthenticationContext).isSupportMode();
  return produce(editMode ? editConfig : displayConfig, draft => {
    if (editMode) {
      draft.groups[0].commands[0].enable = !isReadOnlyMode && invalidRules.size === 0; // disable save
    }
    return documentCommands(draft, formatMessage, aliases);
  });
}

function documentCommands(config: RibbonConfig, formatMessage: (key: any) => string, aliases: Record<string, string>) {
  config.groups.forEach(group => {
    group.description = formatMessage({ id: group.description });
    group.commands.forEach(command => {
      command.description = formatMessage({ id: command.description });
      command.helpUrl = aliases[command.id];
    });
  });
}

export default useRibbonConfig;
