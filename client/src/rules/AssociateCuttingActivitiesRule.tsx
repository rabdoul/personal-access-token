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

export interface AssociateCuttingActivities extends StatementResult {
  activityId?: string;
}

function useActivities() {
  const token = useAccessToken();
  const { data: activities } = useQuery('cut-activities', () => fetchData(token, 'cut-parameters/activities'));
  return activities;
}

const AssociateCuttingActivitiesRule = () => <Rule activityId={'associate-cutting-activities'}>{props => <AssociateCuttingActivitiesResultForm {...props} />}</Rule>;

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
