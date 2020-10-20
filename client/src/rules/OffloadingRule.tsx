import React from 'react';

import useRule from './common/useRule';
import { ActivityId, useUIDispatch, useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { StatementResult } from '../model';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';
import { useAccessToken } from '../base/Authentication';
import { Form, FormLine } from './common/styles';
import DropDownSearch from '@lectra/dropdownsearch';
import DropDownSearchRenderer from './common/DropDownSearchRenderer';
import { useIntl } from 'react-intl';
import { useHelpUrls } from '../base/Help';
import ErrorIcon from './common/ErrorIcon';
import useRuleValidator from './common/useRuleValidator';

export interface Offloading extends StatementResult {
  offloadingRuleId?: string;
}

function useOffloadingRules() {
  const token = useAccessToken();
  const { data: offloadingRules } = useQuery('cutadmin', () => fetchData(token, 'offloading-rules'));
  return offloadingRules;
}

const validateStatementResult = (result: Partial<Offloading>) => {
  return result.offloadingRuleId !== undefined;
};

const OffloadingRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('assist-offloading');
  const activityConfiguration = useActivityConfiguration('assist-offloading');
  const activityId = activityConfiguration?.id as ActivityId | undefined;
  useRuleValidator(activityId, rule, validateStatementResult);

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <OffloadingResultForm {...props} />}
    </Rule>
  );
};

const OffloadingResultForm: React.FC<StatementResultFormProps<Offloading>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const offloadingRules = useOffloadingRules();
  const urls = useHelpUrls('PP_ASSIST-OFFLOADING');

  function handleOffloadingRuleChange(item?: { value: string }) {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'assist-offloading', statementIndex, attribute: 'offloadingRuleId', value: item?.value });
  }
  if (!offloadingRules) {
    return null;
  }
  return (
    <Form>
      <FormLine helpUrl={urls[0]}>
        <label htmlFor={`offloadingRule-${statementIndex}`}>{formatMessage({ id: 'step.offloading.rule' })}</label>
        <DropDownSearch
          data-xlabel="offloading-rule"
          data-xvalue={statementResult.offloadingRuleId ? statementResult.offloadingRuleId : 'none'}
          listItems={offloadingRules}
          value={statementResult.offloadingRuleId}
          onChange={handleOffloadingRuleChange}
          customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => handleOffloadingRuleChange(undefined)} />}
          disabled={disabled}
          placeholder="Search"
          width={200}
          error={statementResult.offloadingRuleId === undefined}
          icon={<ErrorIcon errorKey="error.mandatory.field" />}
        />
      </FormLine>
    </Form>
  );
};

export default OffloadingRule;
