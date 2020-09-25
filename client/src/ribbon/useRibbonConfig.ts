import { RibbonConfig } from '@lectra/embed-ribbon';
import produce from 'immer';
import { useIntl } from 'react-intl';
import { useUIState } from '../UIState';

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
          id: 'EDIT_PRODUCTION_PROCESS',
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
          id: 'SAVE_PRODUCTION_PROCESS',
          type: 'default',
          description: 'command.save',
          imageUrl: save,
          primary: true,
          enable: true,
          action: "document.dispatchEvent(new CustomEvent('RIBBON_ACTION', { 'detail': { 'action': 'SAVE_PRODUCTION_PROCESS' } }))"
        },
        {
          id: 'CANCEL_PRODUCTION_PROCESS_EDITION',
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

function useRibbonConfig() {
  const { formatMessage } = useIntl();
  const { editMode, invalidRules } = useUIState();
  return produce(editMode ? editConfig : displayConfig, draft => {
    if (invalidRules && Object.entries(invalidRules).some(it => it[1].size !== 0)) {
      draft.groups[0].commands[0].enable = false; // disable save
    }
    return internationalizeConfig(formatMessage, draft);
  });
}

function internationalizeConfig(formatMessage: (key: any) => string, config: RibbonConfig) {
  config.groups.forEach(group => {
    group.description = formatMessage({ id: group.description });
    group.commands.forEach(command => {
      command.description = formatMessage({ id: command.description });
    });
  });
}

export default useRibbonConfig;
