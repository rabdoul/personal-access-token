import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

import { RuleId, UIState, useUIState } from '../UIState';
import { useAccessToken } from '../base/Authentication';

export default function useRule<R_ID extends RuleId, R extends UIState[R_ID]>(ruleId: R_ID, init: (rule: R) => void): UIState[R_ID] | undefined {
  const accessToken = useAccessToken();

  const { editMode, [ruleId]: editedRule } = useUIState();

  const { data, isSuccess, isStale } = useQuery<R>(ruleId, () => fetchData(accessToken, `rules/${ruleId}`));

  useEffect(() => {
    if (editMode && isSuccess && !editedRule && !isStale) {
      init(data!);
    }
  }, [editMode, init, isSuccess, isStale, data, editedRule]);

  return editedRule ?? data;
}
