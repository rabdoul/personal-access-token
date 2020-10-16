import React from 'react';

import useRule from './common/useRule';
import { useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule from './common/Rule';
import { StatementResult } from '../model';

export interface RollAssignment extends StatementResult {
  rollAllocationRequired: boolean;
}

const RollAssignmentRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('after-nesting-roll-allocation');
  const activityConfiguration = useActivityConfiguration('after-nesting-roll-allocation');

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {(statementIndex, result) => 'TODO'}
    </Rule>
  );
};

export default RollAssignmentRule;
