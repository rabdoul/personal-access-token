import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

import { ActivityId, useUIDispatch, useUIState } from '../../UIState';
import { useAccessToken } from '../../base/Authentication';
import { ActivityRule, StatementResult } from '../../model';

export default function useRule<T extends StatementResult>(activityId: ActivityId): ActivityRule<T> | undefined {
  const accessToken = useAccessToken();
  const dispatch = useUIDispatch();

  const { data, isSuccess, isStale } = useQuery(['rules', activityId], () => fetchData(accessToken, `rules/${activityId}`));
  const { editMode, [activityId]: editedRule } = useUIState();

  useEffect(() => {
    if (editMode && isSuccess && !editedRule && !isStale) {
      dispatch({ type: 'INIT_RULE', activityId, rule: data! });
    }
  }, [dispatch, activityId, editMode, isSuccess, isStale, data, editedRule]);

  return editedRule ?? data;
}
