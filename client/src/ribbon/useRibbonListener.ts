import { useEffect } from 'react';
import { useAccessToken } from '../base/Authentication';
import { UIState, useUIStateContext } from '../UIState';
import { sendData } from 'raspberry-fetch/dist';
import { useMutation } from 'react-query';

function useRibbonListener() {
  const token = useAccessToken();
  const [uiState, dispatch] = useUIStateContext();

  const [mutate] = useMutation(() => {
    const rulesPatch = getRulesPatch(uiState);
    return sendData(token, 'rules', 'PATCH', rulesPatch);
  });

  useEffect(() => {
    const ribbonActionListener = ((e: CustomEvent) => {
      switch (e.detail.action) {
        case 'EDIT_PRODUCTION_PROCESS': {
          dispatch({ type: 'TOGGLE_EDIT_MODE' });
          break;
        }
        case 'SAVE_PRODUCTION_PROCESS': {
          mutate().then(_ => dispatch({ type: 'TOGGLE_EDIT_MODE' }));
          break;
        }
        case 'CANCEL_PRODUCTION_PROCESS_EDITION': {
          dispatch({ type: 'TOGGLE_EDIT_MODE' });
          break;
        }
        default:
          break;
      }
    }) as EventListener;

    document.addEventListener('RIBBON_ACTION', ribbonActionListener);

    return () => document.removeEventListener('RIBBON_ACTION', ribbonActionListener);
  }, [dispatch, mutate, token, uiState]);
}

export default useRibbonListener;

export const getRulesPatch = (state: UIState) => {
  return state.editedRules.map(ruleId => {
    return {
      op: 'replace',
      path: ruleId,
      value: state[ruleId]
    };
  });
};
