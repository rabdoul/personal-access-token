import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import Input from '@lectra/input';

import { StatementResult } from '../model';
import { ActivityId, useUIDispatch, useUIState } from '../UIState';
import useRule from './common/useRule';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { Form } from './common/styles';
import Rule, { StatementResultFormProps } from './common/Rule';
import useRuleValidator from './common/useRuleValidator';
import ErrorIcon from './common/ErrorIcon';
import { useHelpUrls, CheckBoxWithHelpTooltip, LabelWithHelpTooltip } from '../base/Help';

export interface Sequencing extends StatementResult {
  splitList: boolean;
  firstSubListSize: number;
}

function isFirstSubListSizeValid(firstSubListSize?: number) {
  return firstSubListSize !== undefined && firstSubListSize > 0;
}

const validateStatementResult = (result: Partial<Sequencing>) => {
  return isFirstSubListSizeValid(result.firstSubListSize);
};

const SequencingRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('setup-sequencing');
  const activityConfiguration = useActivityConfiguration('setup-sequencing');
  const activityId = activityConfiguration?.id as ActivityId | undefined;
  useRuleValidator(activityId, rule, validateStatementResult);

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <SequencingResultForm {...props} />}
    </Rule>
  );
};

const SequencingResultForm: React.FC<StatementResultFormProps<Sequencing>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const updateSequencing = (attribute: keyof Sequencing, value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'setup-sequencing', statementIndex, attribute, value });
  };

  const urls = useHelpUrls('PP_SEQ_SPLIT_ORDERS', 'PP_SEQ_PRODUCTS_NUMBER');

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <CheckBoxWithHelpTooltip
        disabled={disabled}
        label={formatMessage({ id: 'rule.sequencing.split.selection' })}
        checked={statementResult.splitList!}
        onChange={value => updateSequencing('splitList', value)}
        xlabel="splitList"
        tickSize={13}
        helpUrl={urls[0]}
      />
      <br />
      {statementResult.splitList && (
        <Fragment>
          <LabelWithHelpTooltip helpUrl={urls[1]} htmlFor="orders-number">
            {formatMessage({ id: 'rule.sequencing.number.orders.sub.selection' })}
          </LabelWithHelpTooltip>
          <Input
            disabled={disabled}
            id="orders-number"
            data-xlabel="orders-number"
            type="number"
            numberMaxDigits={0}
            value={statementResult.firstSubListSize}
            error={!isFirstSubListSizeValid(statementResult.firstSubListSize)}
            icon={<ErrorIcon errorKey="error.not.positive.field" />}
            width={50}
            min={0}
            onBlur={evt => updateSequencing('firstSubListSize', evt.target.value)}
          />
        </Fragment>
      )}
    </Form>
  );
};

export default SequencingRule;
