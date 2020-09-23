import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

import { UIState, useUIState } from '../UIState';
import { useAccessToken } from '../base/Authentication';

type RuleId = keyof Omit<UIState, 'editMode'>;

export default function useRule<R_ID extends RuleId, R>(ruleId: R_ID, init: (rule: R) => void): UIState[R_ID] | undefined {
  const accessToken = useAccessToken();

  const { editMode, [ruleId]: editedRule } = useUIState();

  const { data, isSuccess } = useQuery<R>(ruleId, () => fetchData(accessToken, `rules/${ruleId}`));

  useEffect(() => {
    if (editMode && isSuccess && !editedRule) {
      init(data!);
    }
  }, [editMode, init, isSuccess, data, editedRule]);

  return editedRule ?? data;
}
