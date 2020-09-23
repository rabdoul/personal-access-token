import { useEffect } from 'react';
import { useAccessToken } from '../base/Authentication';
import { useUIDispatch } from '../UIState';

function useRibbonListener() {
  const token = useAccessToken();
  const dispatch = useUIDispatch();
  useEffect(() => {
    const ribbonActionListener = ((e: CustomEvent) => {
      switch (e.detail.action) {
        case 'EDIT_PRODUCTION_PROCESS': {
          dispatch({ type: 'TOGGLE_EDIT_MODE' });
          break;
        }
        case 'SAVE_PRODUCTION_PROCESS': {
          dispatch({ type: 'TOGGLE_EDIT_MODE' });
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
  }, [token, dispatch]);
}

export default useRibbonListener;
