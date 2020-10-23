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

export interface AssociateCuttingActivities extends StatementResult {
  activityId?: string;
}

function useActivities() {
  const token = useAccessToken();
  const { data: activities } = useQuery('cut-activities', () => fetchData(token, 'cut-parameters/activities'));
  return activities;
}

const AssociateCuttingActivitiesRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('associate-cutting-activities');
  const activityConfiguration = useActivityConfiguration('associate-cutting-activities');
  useRuleValidator('associate-cutting-activities', rule);

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <AssociateCuttingActivitiesResultForm {...props} />}
    </Rule>
  );
};

const AssociateCuttingActivitiesResultForm: React.FC<StatementResultFormProps<AssociateCuttingActivities>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const activities = useActivities();
  const urls = useHelpUrls('PP_CUTTING_ACTIVITY');

  function handleRequierementChange(item?: { value: string }) {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'associate-cutting-activities', statementIndex, attribute: 'activityId', value: item?.value });
  }
  if (!activities) {
    return null;
  }
  return (
    <Form>
      <LabelWithHelpTooltip htmlFor={`activity-${statementIndex}`} helpUrl={urls[0]}>
        {formatMessage({ id: 'cutting.activity' })}
      </LabelWithHelpTooltip>
      <DropDownSearch
        data-xlabel="activity"
        data-xvalue={statementResult.activityId ? statementResult.activityId : 'none'}
        listItems={activities}
        value={statementResult.activityId}
        onChange={handleRequierementChange}
        customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => handleRequierementChange(undefined)} />}
        disabled={disabled}
        placeholder="Search"
        width={200}
      />
    </Form>
  );
};

export default AssociateCuttingActivitiesRule;
