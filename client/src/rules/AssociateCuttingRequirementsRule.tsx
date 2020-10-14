import React from 'react';

import useRule from './common/useRule';
import { useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule from './common/Rule';
import { StatementResult } from '../model';

export interface AssociateCuttingRequirements extends StatementResult {
  requirementId?: string;
}

const AssociateCuttingRequirementsRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('associate-cutting-requirements');
  const activityConfiguration = useActivityConfiguration('associate-cutting-requirements');

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {(statementIndex, result) => <span>result form goes here</span>}
    </Rule>
  );
};

export default AssociateCuttingRequirementsRule;
