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
import ErrorIcon from './common/ErrorIcon';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';

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

const OffloadingRule = () => (
  <Rule activityId={'assist-offloading'} validateStatementResult={validateStatementResult}>
    {props => <OffloadingResultForm {...props} />}
  </Rule>
);

const OffloadingResultForm: React.FC<StatementResultFormProps<Offloading>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const offloadingRules = useOffloadingRules() || [];
  const urls = useHelpUrls('PP_ASSIST-OFFLOADING');

  function handleOffloadingRuleChange(item?: { value: string }) {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'assist-offloading', statementIndex, attribute: 'offloadingRuleId', value: item?.value });
  }

  return (
    <Form>
      <LabelWithHelpTooltip helpUrl={urls[0]} htmlFor={`offloadingRule-${statementIndex}`}>
        {formatMessage({ id: 'step.offloading.rule' })}
      </LabelWithHelpTooltip>
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
    </Form>
  );
};

export default OffloadingRule;
