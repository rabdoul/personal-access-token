import { ActivityId, useUIState } from '../UIState';

export default function useRuleErrors(ruleId: ActivityId): Set<string> {
  const invalidRules = useUIState().invalidRules;
  return (invalidRules && invalidRules[ruleId]) || new Set();
}
