import React from 'react';
import { useIntl } from 'react-intl';
import CheckBox from '@lectra/checkbox';
import Input from '@lectra/input';

import { StatementResult } from '../model';
import { ActivityId, useUIDispatch, useUIState } from '../UIState';
import useRule from './common/useRule';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { Form, FormLine } from './common/styles';
import Rule from './common/Rule';
import useRuleValidator from './common/useRuleValidator';
import ErrorIcon from './common/ErrorIcon';
import { useHelpUrls } from '../base/Help';

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
      {(statementIndex, result) => <SequencingResultForm sequencing={result} statementIndex={statementIndex} disabled={!editMode} />}
    </Rule>
  );
};

type FormProps = {
  sequencing: Partial<Sequencing>;
  statementIndex: number;
  disabled: boolean;
};

const SequencingResultForm: React.FC<FormProps> = ({ sequencing, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const updateSequencing = (attribute: keyof Sequencing, value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'setup-sequencing', statementIndex, attribute, value });
  };

  const urls = useHelpUrls('PP_SEQ_SPLIT_ORDERS', 'PP_SEQ_PRODUCTS_NUMBER');

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine helpUrl={urls[0]}>
        <CheckBox
          disabled={disabled}
          label={formatMessage({ id: 'rule.sequencing.split.selection' })}
          checked={sequencing.splitList!}
          onChange={value => updateSequencing('splitList', value)}
          xlabel="splitList"
          tickSize={13}
        />
      </FormLine>
      {sequencing.splitList && (
        <FormLine helpUrl={urls[1]}>
          <label htmlFor="orders-number">{formatMessage({ id: 'rule.sequencing.number.orders.sub.selection' })}</label>
          <Input
            disabled={disabled}
            id="orders-number"
            data-xlabel="orders-number"
            type="number"
            numberMaxDigits={0}
            value={sequencing.firstSubListSize}
            error={!isFirstSubListSizeValid(sequencing.firstSubListSize)}
            icon={<ErrorIcon errorKey="error.not.positive.field" />}
            width={50}
            min={0}
            onBlur={evt => updateSequencing('firstSubListSize', evt.target.value)}
          />
        </FormLine>
      )}
    </Form>
  );
};

export default SequencingRule;
