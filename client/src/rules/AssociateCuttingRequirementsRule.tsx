import React from 'react';

import useRule from './useRule';
import { ActivityRule, AssociateCuttingRequirements } from '../model';
import { useUIStateContext } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule from './Rule';

const AssociateCuttingRequirementsRule = () => {
  const [{ editMode }, dispatch] = useUIStateContext();
  const rule = useRule<'associate-cutting-requirements', ActivityRule<AssociateCuttingRequirements>>('associate-cutting-requirements', rule =>
    dispatch({ type: 'INIT_ASSOCIATE_CUTTING_REQUIREMENTS_RULE', associateCuttingRequirements: rule })
  );
  const { data: activityConfiguration } = useActivityConfiguration('associate-cutting-requirements');

  if (!rule || !activityConfiguration) return null;

  return (
    <Rule activityId={'associate-cutting-requirements'} activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {(statementIndex, result) => <span>result form goes here</span>}
    </Rule>
  );
};

export default AssociateCuttingRequirementsRule;
