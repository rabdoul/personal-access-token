import { RuleId, useUIState } from '../UIState';

export default function useRuleErrors(ruleId: RuleId): Set<string> {
  const invalidRules = useUIState().invalidRules;
  return (invalidRules && invalidRules[ruleId]) || new Set();
}
