import React, { useContext, useEffect } from 'react';
import { CuttingRoomNotifierClient, EventType, NotifierEnv } from 'cutting-room-notifier-client';
import { useQueryCache } from 'react-query';

import { useUIDispatch } from './UIState';
import { AuthenticationContext } from './base/Authentication';

const Notifier = () => {
  const token = useContext(AuthenticationContext).accessToken();
  const dispatch = useUIDispatch();
  const queryCache = useQueryCache();

  useEffect(() => {
    const host = window.location.hostname;
    const notifierClient = CuttingRoomNotifierClient.fromEnv(computeNotifierEnv(host), token);

    notifierClient.on('ProductionRules', EventType.Updated, () => {
      queryCache.invalidateQueries('rules').then(() => dispatch({ type: 'RESET_EDIT_MODE' }));
    });

    notifierClient.start();

    return () => {
      notifierClient.stop();
    };
  }, [dispatch, queryCache, token]);

  return null;
};

export function computeNotifierEnv(host: String): NotifierEnv {
  if (host === 'localhost') {
    return NotifierEnv.Local;
  } else {
    if (host.endsWith('dev.mylectra.com')) {
      return NotifierEnv.Dev;
    }
    if (host.endsWith('test.mylectra.com')) {
      return NotifierEnv.Test;
    }
    return NotifierEnv.Prod;
  }
}

export default React.memo(Notifier);
