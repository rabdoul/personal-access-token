import React from 'react';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { StatementResult } from '../model';
import Rule from './common/Rule';
import StepDescription from './common/StepDescription';
import useRule from './common/useRule';

export interface Publish extends StatementResult {
  isAutomaticallyPublished: boolean;
}

export const PublishRule: React.FC = () => {
  const rule = useRule('publish');
  const activityConfiguration = useActivityConfiguration('publish');
  if (rule !== undefined && activityConfiguration !== undefined) {
    return (
      <Rule rule={rule} activityConfiguration={activityConfiguration} disabled={false}>
        {(statementIndex, result) => <span>result form goes here</span>}
      </Rule>
    );
  } else {
    return <StepDescription />;
  }
};
