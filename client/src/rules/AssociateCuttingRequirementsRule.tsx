import React from 'react';

import useRule from './common/useRule';
import { useUIDispatch, useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule from './common/Rule';
import { StatementResult } from '../model';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';
import { useAccessToken } from '../base/Authentication';
import { Form, FormLine } from './common/styles';
import DropDownSearch from '@lectra/dropdownsearch';
import DropDownSearchRenderer from './common/DropDownSearchRenderer';
import { useIntl } from 'react-intl';
import { useHelpUrls } from '../base/Help';

export interface AssociateCuttingRequirements extends StatementResult {
  requirementId?: string;
}

function useRequirements() {
  const token = useAccessToken();
  const { data: requirements } = useQuery('cut-activities', () => fetchData(token, 'cut-parameters/requirements'));
  return requirements;
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
      {(statementIndex, result) => <AssociateCuttingRequirementsResultForm associateRequierements={result} statementIndex={statementIndex} disabled={!editMode} />}
    </Rule>
  );
};

type FormProps = {
  associateRequierements: Partial<AssociateCuttingRequirements>;
  statementIndex: number;
  disabled: boolean;
};

const AssociateCuttingRequirementsResultForm: React.FC<FormProps> = ({ associateRequierements, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const requirements = useRequirements();
  const urls = useHelpUrls('PP_REQUIREMENT');

  function handleRequierementChange(item?: { value: string }) {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'associate-cutting-requirements', statementIndex, attribute: 'requirementId', value: item?.value });
  }
  if (!requirements) {
    return null;
  }
  return (
    <Form>
      <FormLine helpUrl={urls[0]}>
        <label htmlFor={`requirement-${statementIndex}`}>{formatMessage({ id: 'requirement' })}</label>
        <DropDownSearch
          data-xlabel="requirement"
          id={`requirement-${statementIndex}`}
          listItems={requirements}
          value={associateRequierements.requirementId}
          onChange={handleRequierementChange}
          customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => handleRequierementChange(undefined)} />}
          disabled={disabled}
          placeholder="Search"
          width={200}
        />
      </FormLine>
    </Form>
  );
};

export default AssociateCuttingRequirementsRule;
