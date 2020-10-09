import React from 'react';
import styled from 'styled-components/macro';

import { ActivityConfiguration, ActivityRule, RuleResult } from '../model';
import StepDescription from './StepDescription';
import ConditionBlock from './ConditionBlock';
import ResultBlock from './ResultBlock';
import ElseBlock from './ElseBlock';
import { ActivityId } from '../UIState';

interface Props {
  activityId: ActivityId;
  activityConfiguration: ActivityConfiguration;
  disabled: boolean;
  rule: ActivityRule<RuleResult>;
  children: (statementIndex: number, result: RuleResult) => React.ReactNode;
}

const Rule = ({ children, activityId, activityConfiguration, rule, disabled }: Props) => {
  return (
    <Container>
      <StepDescription />
      {rule.map((statement, statementIndex) => {
        return (
          <div key={statementIndex}>
            {statement.conditions.map((condition, conditionIndex) => (
              <ConditionBlock
                key={`${statementIndex}-${conditionIndex}`}
                statementIndex={statementIndex}
                condition={condition}
                activityId={activityId}
                activityConfiguration={activityConfiguration}
                conditionIndex={conditionIndex}
                disabled={disabled}
              />
            ))}
            {rule.length !== 1 && statementIndex === rule?.length - 1 && <ElseBlock activityId={activityId} disabled={disabled} />}
            <ResultBlock activityId={activityId} conditional={activityConfiguration.conditions.length > 0} isDefault={rule.length === 1} disabled={disabled}>
              {children(statementIndex, statement.result!)}
            </ResultBlock>
          </div>
        );
      })}
    </Container>
  );
};

export default Rule;

const Container = styled.div`
  height: calc(100% - 95px);
  padding: 20px;
  width: calc(100% - 380px);
  overflow: auto;
`;
