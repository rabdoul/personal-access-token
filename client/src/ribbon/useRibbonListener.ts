import { useEffect } from 'react';
import { useAccessToken } from '../base/Authentication';
import { useUIStateContext } from '../UIState';
import { sendData } from 'raspberry-fetch/dist';
import { useMutation } from 'react-query';

function useRibbonListener() {
  const token = useAccessToken();
  const [uiState, dispatch] = useUIStateContext();

  const [mutate] = useMutation(() => {
    const sequencing = uiState['setup-sequencing'];
    const patch = {
      op: 'replace',
      path: 'setup-sequencing',
      value: sequencing
    };
    return sendData(token, 'rules', 'PATCH', [patch]);
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
