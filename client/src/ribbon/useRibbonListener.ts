import { useEffect, useContext } from 'react';
import { AuthenticationContext } from '../base/Authentication';

function useRibbonListener() {
  const token = useContext(AuthenticationContext).accessToken();
  useEffect(() => {
    const ribbonActionListener = ((e: CustomEvent) => {
      switch (e.detail.action) {
        case 'EDIT_PRODUCTION_PROCESS': {
          console.log('TODO: edit process');
          break;
        }
        case 'SAVE_PRODUCTION_PROCESS': {
          console.log('TODO: save process');
          break;
        }
        case 'CANCEL_PRODUCTION_PROCESS_EDITION': {
          console.log('TODO: cancel process edition');
          break;
        }
        default:
          break;
      }
    }) as EventListener;

    document.addEventListener('RIBBON_ACTION', ribbonActionListener);

    return () => document.removeEventListener('RIBBON_ACTION', ribbonActionListener);
  }, [token]);
}

export default useRibbonListener;
