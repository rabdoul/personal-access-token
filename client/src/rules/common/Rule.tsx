import React from 'react';

import { ActivityConfiguration, ActivityRule, StatementResult } from '../../model';
import StepDescription from './StepDescription';
import ConditionBlock from './ConditionBlock';
import ResultBlock from './ResultBlock';
import DefaultConditionBlock from './DefaultConditionBlock';
import { ActivityId } from '../../UIState';
import { RuleContainer } from './styles';

export type StatementResultFormProps<T extends StatementResult> = {
  statementIndex: number;
  statementResult: Partial<T>;
  disabled: boolean;
};

type Props<T extends StatementResult> = {
  children: (formProps: StatementResultFormProps<T>) => React.ReactNode;
  activityConfiguration?: ActivityConfiguration;
  rule?: ActivityRule<StatementResult>;
  disabled: boolean;
};

const Rule = <T extends StatementResult>({ children, activityConfiguration, rule, disabled }: Props<T>) => {
  return (
    <RuleContainer>
      <StepDescription />
      {activityConfiguration &&
        rule &&
        rule.map((statement, statementIndex) => {
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
                  disabled={disabled}
                />
              ))}
              {rule.length !== 1 && statementIndex === rule?.length - 1 && <DefaultConditionBlock activityId={activityConfiguration.id as ActivityId} disabled={disabled} />}
              <ResultBlock
                xid={statementIndex}
                activityId={activityConfiguration.id as ActivityId}
                conditional={activityConfiguration.conditions.length > 0}
                isDefault={rule.length === 1}
                disabled={disabled}
              >
                {children({ statementIndex, statementResult: statement.result!, disabled })}
              </ResultBlock>
            </div>
          );
        })}
    </RuleContainer>
  );
};

export default Rule;
