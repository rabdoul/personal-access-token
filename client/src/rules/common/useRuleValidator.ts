import { useEffect } from 'react';
import { Statement, Condition } from '../../model';
import { ActivityId, useUIDispatch } from '../../UIState';

function validateRule<T>(rule: Statement<T>[], validateStatementResult: (result: Partial<T>) => boolean): boolean {
  return rule.every(statement => validateStatementConditions(statement) && validateStatementResult(statement.result));
}

function validateStatementConditions(statement: Statement<any>): boolean {
  return statement.conditions.reduce((acc: boolean, current: Condition) => acc && validateStatementCondition(current), true);
}

function validateStatementCondition(condition: Condition): boolean {
  return condition.multipleOperator !== undefined && condition.reference !== undefined && condition.operator !== undefined && condition.value !== undefined;
}

const defaultValidateStatement = () => true;

export default function useRuleValidator<T>(activityId?: ActivityId, rule?: Statement<T>[], validateStatementResult?: (result: Partial<T>) => boolean) {
  const dispatch = useUIDispatch();
  useEffect(() => {
    if (rule && activityId) {
      const isValid = validateRule(rule, validateStatementResult || defaultValidateStatement);
      if (isValid) {
        dispatch({ type: 'VALIDATE_RULE', activityId });
      } else {
        dispatch({ type: 'INVALIDATE_RULE', activityId });
      }
    }
  }, [dispatch, rule, activityId, validateStatementResult]);
}
