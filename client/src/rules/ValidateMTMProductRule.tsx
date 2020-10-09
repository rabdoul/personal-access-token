import React from 'react';
import CheckBox from '@lectra/checkbox';

import useRule from './useRule';
import { ActivityRule, ValidateMTMProduct } from '../model';
import { useUIStateContext } from '../UIState';
import { useIntl } from 'react-intl';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { Form } from './styled-components';
import Rule from './Rule';

const ValidateMTMProductRule = () => {
  const [{ editMode }, dispatch] = useUIStateContext();
  const rule = useRule<'validate-mtm-product', ActivityRule<ValidateMTMProduct>>('validate-mtm-product', validateMTMProductRule =>
    dispatch({ type: 'INIT_VALIDATE_MTM_PRODUCT_RULE', validateMTMProduct: validateMTMProductRule })
  );
  const { data: activityConfiguration } = useActivityConfiguration('validate-mtm-product');

  if (!rule || !activityConfiguration) return null;

  return (
    <Rule activityId={'validate-mtm-product'} activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {(statementIndex, result) => <ValidateMTMProductResultForm validateMTMProduct={result} statementIndex={statementIndex} disabled={!editMode} />}
    </Rule>
  );
};

interface FormProps {
  validateMTMProduct: Partial<ValidateMTMProduct>;
  statementIndex: number;
  disabled: boolean;
}

const ValidateMTMProductResultForm: React.FC<FormProps> = ({ validateMTMProduct, disabled }) => {
  const { formatMessage } = useIntl();
  const [, dispatch] = useUIStateContext();

  const updateValidateMTMProduct = (attribute: keyof ValidateMTMProduct, value: any) => {
    dispatch({ type: 'UPDATE_VALIDATE_MTM_PRODUCT', attribute, value, isValid: true, statementIndex: 0 });
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
