import React from 'react';

import useRule from './common/useRule';
import { useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule from './common/Rule';
import { StatementResult } from '../model';

export interface GenerateSectionPlan extends StatementResult {
  rollAllocationRequired: boolean;
}

const GenerateSectionPlanRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('generate-section-plan');
  const activityConfiguration = useActivityConfiguration('generate-section-plan');

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {(statementIndex, result) => 'TODO'}
    </Rule>
  );
};

export default GenerateSectionPlanRule;
