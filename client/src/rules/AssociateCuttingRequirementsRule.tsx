import React from 'react';

import useRule from './common/useRule';
import { useUIDispatch, useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { StatementResult } from '../model';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';
import { useAccessToken } from '../base/Authentication';
import { Form } from './common/styles';
import DropDownSearch from '@lectra/dropdownsearch';
import DropDownSearchRenderer from './common/DropDownSearchRenderer';
import { useIntl } from 'react-intl';
import { LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import useRuleValidator from './common/useRuleValidator';

export interface AssociateCuttingRequirements extends StatementResult {
  requirementId?: string;
}

function useRequirements() {
  const token = useAccessToken();
  const { data: requirements } = useQuery('cut-requirements', () => fetchData(token, 'cut-parameters/requirements'));
  return requirements;
}

const AssociateCuttingRequirementsRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('associate-cutting-requirements');
  const activityConfiguration = useActivityConfiguration('associate-cutting-requirements');
  useRuleValidator('associate-cutting-requirements', rule);

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <AssociateCuttingRequirementsResultForm {...props} />}
    </Rule>
  );
};

const AssociateCuttingRequirementsResultForm: React.FC<StatementResultFormProps<AssociateCuttingRequirements>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const requirements = useRequirements();
  const urls = useHelpUrls('PP_CUTTING_REQUIREMENT');

  function handleRequierementChange(item?: { value: string }) {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'associate-cutting-requirements', statementIndex, attribute: 'requirementId', value: item?.value });
  }
  if (!requirements) {
    return null;
  }
  return (
    <Form>
      <LabelWithHelpTooltip htmlFor={`requirement-${statementIndex}`} helpUrl={urls[0]}>
        {formatMessage({ id: 'cutting.requirement' })}
      </LabelWithHelpTooltip>
      <DropDownSearch
        data-xlabel="requirement"
        data-xvalue={statementResult.requirementId ? statementResult.requirementId : 'none'}
        listItems={requirements}
        value={statementResult.requirementId}
        onChange={handleRequierementChange}
        customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => handleRequierementChange(undefined)} />}
        disabled={disabled}
        placeholder="Search"
        width={200}
      />
    </Form>
  );
};

export default AssociateCuttingRequirementsRule;
