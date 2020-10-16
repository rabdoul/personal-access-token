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

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {(statementIndex, result) => <AssociateCuttingActivitiesResultForm associateActivities={result} statementIndex={statementIndex} disabled={!editMode} />}
    </Rule>
  );
};

type FormProps = {
  associateActivities: Partial<AssociateCuttingActivities>;
  statementIndex: number;
  disabled: boolean;
};

const AssociateCuttingActivitiesResultForm: React.FC<FormProps> = ({ associateActivities, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const activities = useActivities();
  const urls = useHelpUrls('PP_REQUIREMENT');

  function handleRequierementChange(item?: { value: string }) {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'associate-cutting-activities', statementIndex, attribute: 'activityId', value: item?.value });
  }
  if (!activities) {
    return null;
  }
  return (
    <Form>
      <FormLine helpUrl={urls[0]}>
        <label htmlFor={`activity-${statementIndex}`}>{formatMessage({ id: 'cutting.activity' })}</label>
        <DropDownSearch
          id={`requirement-${statementIndex}`}
          listItems={activities}
          value={associateActivities.activityId}
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

export default AssociateCuttingActivitiesRule;
