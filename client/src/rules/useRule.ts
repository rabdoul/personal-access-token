import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

import { ActivityId, UIState, useUIState } from '../UIState';
import { useAccessToken } from '../base/Authentication';

export default function useRule<ACTIVITY_ID extends ActivityId, R extends UIState[ACTIVITY_ID]>(
  activityId: ACTIVITY_ID,
  init: (rule: R) => void
): UIState[ACTIVITY_ID] | undefined {
  const accessToken = useAccessToken();

  const { editMode, [activityId]: editedRule } = useUIState();

  const { data, isSuccess, isStale } = useQuery<R>(['rules', activityId], () => fetchData(accessToken, `rules/${activityId}`));

  useEffect(() => {
    if (editMode && isSuccess && !editedRule && !isStale) {
      init(data!);
    }
  }, [editMode, init, isSuccess, isStale, data, editedRule]);

  return editedRule ?? data;
}
