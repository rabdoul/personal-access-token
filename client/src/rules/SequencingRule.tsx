import React from 'react';
import { useIntl } from 'react-intl';
import CheckBox from '@lectra/checkbox';
import Input from '@lectra/input';

import { ActivityRule, Sequencing } from '../model';
import { useUIStateContext } from '../UIState';
import useRule from './useRule';
import useRuleErrors from './useRuleErrors';
import ErrorIcon from '../common/ErrorIcon';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { Form, FormLine } from './styled-components';
import Rule from './Rule';

const SequencingRule = () => {
  const [{ editMode }, dispatch] = useUIStateContext();

  const rule = useRule<'setup-sequencing', ActivityRule<Sequencing>>('setup-sequencing', sequencingRule => dispatch({ type: 'INIT_SEQUENCING_RULE', sequencing: sequencingRule }));

  const { data: activityConfiguration } = useActivityConfiguration('setup-sequencing');

  if (!rule || !activityConfiguration) return null;

  return (
    <Rule activityId={'setup-sequencing'} activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {(statementIndex, result) => <SequencingResultForm sequencing={result} statementIndex={statementIndex} disabled={!editMode} />}
    </Rule>
  );
};

interface FormProps {
  sequencing: Partial<Sequencing>;
  statementIndex: number;
  disabled: boolean;
}

const SequencingResultForm: React.FC<FormProps> = ({ sequencing, disabled }) => {
  const { formatMessage } = useIntl();
  const [, dispatch] = useUIStateContext();

  const updateSequencing = (attribute: keyof Sequencing, value: any, isValid: boolean = true) => {
    dispatch({ type: 'UPDATE_SEQUENCING', attribute, value, isValid, statementIndex: 0 });
  };

  const invalidFields = useRuleErrors('setup-sequencing');

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <CheckBox
        disabled={disabled}
        label={formatMessage({ id: 'rule.sequencing.split.selection' })}
        checked={sequencing.splitList!}
        onChange={value => updateSequencing('splitList', value)}
        xlabel="splitList"
        tickSize={13}
      />
      {sequencing.splitList && (
        <FormLine>
          <label htmlFor="orders-number">{formatMessage({ id: 'rule.sequencing.number.orders.sub.selection' })}</label>
          <Input
            disabled={disabled}
            id="orders-number"
            type="number"
            numberMaxDigits={0}
            value={sequencing.firstSubListSize}
            width={50}
            error={invalidFields.has('numberOfProductOrders')}
            icon={<ErrorIcon errorKey="error.not.positive.field" />}
            min={0}
            onChange={evt => updateSequencing('firstSubListSize', evt.target.value, evt.target.value !== '' && evt.target.value !== '0')}
          />
        </FormLine>
      )}
    </Form>
  );
};

export default SequencingRule;
