import React from 'react';

import useActivityConfiguration from '../../activities/useActivityConfiguration';
import { Statement, StatementResult } from '../../model';
import { ActivityId, useUIState } from '../../UIState';
import ConditionBlock from './ConditionBlock';
import DefaultConditionBlock from './DefaultConditionBlock';
import ResultBlock from './ResultBlock';
import StepDescription from './StepDescription';
import { RuleContainer } from './styles';
import useRule from './useRule';
import useRuleValidator from './useRuleValidator';

export type StatementResultFormProps<T extends StatementResult> = {
  statementIndex: number;
  statementResult: Partial<T>;
  disabled: boolean;
};

type Props<T extends StatementResult> = {
  activityId: ActivityId;
  validateStatementResult?: (result: Partial<T>) => boolean;
  children: (formProps: StatementResultFormProps<T>) => React.ReactNode;
};

function Rule<T extends StatementResult>({ children, activityId, validateStatementResult }: Props<T>) {
  const { editMode } = useUIState();
  const rule = useRule(activityId);
  const activityConfiguration = useActivityConfiguration(activityId);
  useRuleValidator(activityId, rule, validateStatementResult);

  return (
    <RuleContainer>
      <StepDescription />
      {activityConfiguration &&
        rule &&
        rule.map((statement: Statement<T>, statementIndex: number) => {
          return (
            <div id={`statement-${statementIndex}`} key={statementIndex}>
              {statement.conditions.map((condition, conditionIndex) => (
                <ConditionBlock
                  xid={`${statementIndex}-${conditionIndex}`}
                  key={`${statementIndex}-${conditionIndex}`}
                  statementIndex={statementIndex}
                  condition={condition}
                  activityConfiguration={activityConfiguration}
                  conditionIndex={conditionIndex}
                  disabled={!editMode}
                />
              ))}
              {rule.length !== 1 && statementIndex === rule?.length - 1 && <DefaultConditionBlock activityId={activityId} disabled={!editMode} />}
              <ResultBlock
                xid={statementIndex}
                activityId={activityId}
                conditional={activityConfiguration.conditions.length > 0}
                isDefault={rule.length === 1}
                disabled={!editMode}
              >
                {children({ statementIndex, statementResult: statement.result!, disabled: !editMode })}
              </ResultBlock>
            </div>
          );
        })}
    </RuleContainer>
  );
}

export default Rule;
