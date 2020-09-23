import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

import { useUIStateContext, UIState } from '../UIState';
import { useAccessToken } from '../base/Authentication';

type RuleId = keyof Omit<UIState, 'editMode'>;

export default function useRule<R_ID extends RuleId, R>(ruleId: R_ID, init: (rule: R) => void): UIState[R_ID] {
  const accessToken = useAccessToken();

  const [{ editMode, [ruleId]: editedRule }, dispatch] = useUIStateContext();

  const { data, isSuccess } = useQuery<R>(ruleId, () => fetchData(accessToken, `activities/${ruleId}`));

  useEffect(() => {
    console.log('Effect executed');
    if (editMode && isSuccess && !editedRule) {
      init(data!);
    }
  }, [editMode, init, isSuccess, dispatch, data, editedRule]);

  return editedRule ?? data;
}
