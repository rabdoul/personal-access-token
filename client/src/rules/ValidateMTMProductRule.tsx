import React from 'react';
import CheckBox from '@lectra/checkbox';

import useRule from './useRule';
import { ValidateMTMProduct } from '../model';
import { ActivityId, useUIDispatch, useUIState } from '../UIState';
import { useIntl } from 'react-intl';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { Form } from './styles';
import Rule from './Rule';
import useRuleValidator from './useRuleValidator';

const ValidateMTMProductRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('validate-mtm-product');
  const activityConfiguration = useActivityConfiguration('validate-mtm-product');

  useRuleValidator(rule, activityConfiguration?.id as ActivityId | undefined);

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {(statementIndex, result) => <ValidateMTMProductResultForm validateMTMProduct={result} statementIndex={statementIndex} disabled={!editMode} />}
    </Rule>
  );
};

type FormProps = {
  validateMTMProduct: Partial<ValidateMTMProduct>;
  statementIndex: number;
  disabled: boolean;
};

const ValidateMTMProductResultForm: React.FC<FormProps> = ({ validateMTMProduct, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const updateValidateMTMProduct = (attribute: keyof ValidateMTMProduct, value: any) => {
    dispatch({ type: 'UPDATE_VALIDATE_MTM_PRODUCT', attribute, value, statementIndex });
  };
  return (
    <Form onSubmit={e => e.preventDefault()}>
      <CheckBox
        disabled={disabled}
        label={formatMessage({ id: 'rule.validate.mtm.product.stop.out.of.range' })}
        checked={validateMTMProduct.stopOnOutOfRangeWarning!}
        onChange={value => updateValidateMTMProduct('stopOnOutOfRangeWarning', value)}
        xlabel="stopOnOutOfRangeWarning"
        tickSize={13}
      />
      <CheckBox
        disabled={disabled}
        label={formatMessage({ id: 'rule.validate.mtm.product.stop.incorrect.value' })}
        checked={validateMTMProduct.stopOnIncorrectValueWarning!}
        onChange={value => updateValidateMTMProduct('stopOnIncorrectValueWarning', value)}
        xlabel="stopOnIncorrectValueWarning"
        tickSize={13}
      />
    </Form>
  );
};

export default ValidateMTMProductRule;
