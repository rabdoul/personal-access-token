import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

import { ActivityId, UIState, useUIDispatch, useUIState } from '../UIState';
import { useAccessToken } from '../base/Authentication';

export default function useRule<ACTIVITY_ID extends ActivityId, R extends UIState[ACTIVITY_ID]>(activityId: ACTIVITY_ID): UIState[ACTIVITY_ID] | undefined {
  const accessToken = useAccessToken();
  const dispatch = useUIDispatch();

  const { editMode, [activityId]: editedRule } = useUIState();

  const { data, isSuccess, isStale } = useQuery<R>(['rules', activityId], () => {
    return fetchData(accessToken, `rules/${activityId}`);
  });

  useEffect(() => {
    if (editMode && isSuccess && !editedRule && !isStale) {
      dispatch({ type: 'INIT_RULE', activityId, rule: data! });
    }
  }, [dispatch, activityId, editMode, isSuccess, isStale, data, editedRule]);

  return editedRule ?? data;
}
