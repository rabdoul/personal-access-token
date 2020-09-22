import { RibbonConfig } from '@lectra/embed-ribbon';
import produce from 'immer';
import { useIntl } from 'react-intl';

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
      description: 'group.edit',
      commands: [
        {
          id: 'SAVE_PRODUCTION_PROCESS',
          type: 'default',
          description: 'command.save',
          imageUrl: save,
          primary: true,
          enable: false,
          action: "document.dispatchEvent(new CustomEvent('RIBBON_ACTION', { 'detail': { 'action': 'SAVE_PRODUCTION_PROCESS' } }))"
        },
        {
          id: 'CANCEL_PRODUCTION_PROCESS_EDITION',
          type: 'default',
          description: 'command.cancel',
          imageUrl: cancel,
          primary: true,
          enable: false,
          action: "document.dispatchEvent(new CustomEvent('RIBBON_ACTION', { 'detail': { 'action': 'CANCEL_PRODUCTION_PROCESS_EDITION' } }))"
        }
      ]
    }
  ]
};

function useRibbonConfig() {
  // TODO use mode to return the right config
  const { formatMessage } = useIntl();
  return produce(displayConfig, draft => {
    draft.groups[0].description = formatMessage({ id: displayConfig.groups[0].description });
    draft.groups[0].commands[0].description = formatMessage({ id: displayConfig.groups[0].commands[0].description });
  });
}

export default useRibbonConfig;
