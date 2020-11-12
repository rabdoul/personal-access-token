import React from 'react';
import DropDownSearch from '@lectra/dropdownsearch';
import { fetchData } from 'raspberry-fetch';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { useAccessToken } from '../base/Authentication';
import { LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import { StatementResult } from '../model';
import { useUIDispatch } from '../UIState';
import DropDownSearchRenderer from './common/DropDownSearchRenderer';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';

export interface AssociateCuttingRequirements extends StatementResult {
  requirementId?: string;
}

function useRequirements() {
  const token = useAccessToken();
  const { data: requirements } = useQuery('cut-requirements', () => fetchData(token, 'cut-parameters/requirements'));
  return requirements;
}

const AssociateCuttingRequirementsRule = () => <Rule activityId={'associate-cutting-requirements'}>{props => <AssociateCuttingRequirementsResultForm {...props} />}</Rule>;

const AssociateCuttingRequirementsResultForm: React.FC<StatementResultFormProps<AssociateCuttingRequirements>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const requirements = useRequirements() || [];
  const urls = useHelpUrls('PP_CUTTING_REQUIREMENT');

  function handleRequierementChange(item?: { value: string }) {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'associate-cutting-requirements', statementIndex, attribute: 'requirementId', value: item?.value });
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
        placeholder={formatMessage({ id: 'common.search' })}
        width={200}
      />
    </Form>
  );
};

export default AssociateCuttingRequirementsRule;
