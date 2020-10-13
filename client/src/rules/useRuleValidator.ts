import { useEffect } from 'react';
import { Statement, Condition } from '../model';
import { ActivityId, useUIDispatch } from '../UIState';

function validateRule(rule: Statement<any>[], statementValidator: (statement: Statement<any>) => boolean): boolean {
  return rule.every(statement => validateStatementConditions(statement) && statementValidator(statement));
}

function validateStatementConditions(statement: Statement<any>): boolean {
  return statement.conditions.reduce((acc: boolean, current: Condition) => acc && validateStatementCondition(current), true);
}

function validateStatementCondition(condition: Condition): boolean {
  return 'reference' in condition && 'operator' in condition && 'multipleOperator' in condition && 'value' in condition;
}

const defaultValidator = () => true;

export default function useRuleValidator(rule?: Statement<any>[], activityId?: ActivityId, statementValidator?: (statement: Statement<any>) => boolean) {
  const dispatch = useUIDispatch();
  useEffect(() => {
    if (rule && activityId) {
      const isValid = validateRule(rule, defaultValidator);
      dispatch({ type: isValid ? 'VALIDATE_RULE' : 'INVALIDATE_RULE', activityId });
    }
  }, [dispatch, rule, activityId, statementValidator]);
}
