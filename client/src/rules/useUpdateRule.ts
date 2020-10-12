import { useUIState } from '../UIState';
import { useMutation } from 'react-query';
import { sendData } from 'raspberry-fetch';

import { useAccessToken } from '../base/Authentication';

export default function useUpdateRule() {
  const token = useAccessToken();
  const state = useUIState();

  return useMutation(() => {
    const patch = Array.from(state.editedRules).map(ruleId => ({
      op: 'replace',
      path: ruleId,
      value: state[ruleId]!
    }));
    return sendData(token, 'rules', 'PATCH', patch);
  });
}
