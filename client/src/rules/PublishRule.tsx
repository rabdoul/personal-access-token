import React from 'react';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { StatementResult } from '../model';
import { ActivityId } from '../UIState';
import Rule from './common/Rule';
import StepDescription from './common/StepDescription';
import useRule from './common/useRule';
import useRuleValidator from './common/useRuleValidator';
import { useUIState } from '../UIState';

export interface Publish extends StatementResult {
  isAutomaticallyPublished: boolean;
}

export const PublishRule: React.FC = () => {
  const rule = useRule('publish');
  const { editMode } = useUIState();
  const activityConfiguration = useActivityConfiguration('publish');
  const activityId = activityConfiguration?.id as ActivityId | undefined;
  useRuleValidator(activityId, rule);
  if (rule !== undefined && activityConfiguration !== undefined) {
    return (
      <Rule rule={rule} activityConfiguration={activityConfiguration} disabled={!editMode}>
        {(statementIndex, result) => <span>result form goes here</span>}
      </Rule>
    );
  } else {
    return <StepDescription />;
  }
};
