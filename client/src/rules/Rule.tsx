import React from 'react';

import { ActivityConfiguration, ActivityRule, RuleResult } from '../model';
import StepDescription from './StepDescription';
import ConditionBlock from './ConditionBlock';
import ResultBlock from './ResultBlock';
import DefaultConditionBlock from './DefaultConditionBlock';
import { ActivityId } from '../UIState';
import { RuleContainer } from './styles';

type Props = {
  activityConfiguration: ActivityConfiguration;
  disabled: boolean;
  rule: ActivityRule<RuleResult>;
  children: (statementIndex: number, result: RuleResult) => React.ReactNode;
};

const Rule = ({ children, activityConfiguration, rule, disabled }: Props) => {
  const activityId = activityConfiguration.id as ActivityId;
  return (
    <RuleContainer>
      <StepDescription />
      {rule.map((statement, statementIndex) => {
        return (
          <div key={statementIndex}>
            {statement.conditions.map((condition, conditionIndex) => (
              <ConditionBlock
                key={`${statementIndex}-${conditionIndex}`}
                statementIndex={statementIndex}
                condition={condition}
                activityConfiguration={activityConfiguration}
                conditionIndex={conditionIndex}
                disabled={disabled}
              />
            ))}
            {rule.length !== 1 && statementIndex === rule?.length - 1 && <DefaultConditionBlock activityId={activityId} disabled={disabled} />}
            <ResultBlock activityId={activityId} conditional={activityConfiguration.conditions.length > 0} isDefault={rule.length === 1} disabled={disabled}>
              {children(statementIndex, statement.result!)}
            </ResultBlock>
          </div>
        );
      })}
    </RuleContainer>
  );
};

export default Rule;
