import React from 'react';
import CheckBox from '@lectra/checkbox';

import useRule from './common/useRule';
import { StatementResult } from '../model';
import { ActivityId, useUIDispatch, useUIState } from '../UIState';
import { useIntl } from 'react-intl';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { Form, FormLine } from './common/styles';
import Rule from './common/Rule';
import useRuleValidator from './common/useRuleValidator';
import { useHelpUrl } from '../base/Help';

export interface ValidateMTMProduct extends StatementResult {
  stopOnOutOfRangeWarning: boolean;
  stopOnIncorrectValueWarning: boolean;
}

const ValidateMTMProductRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('validate-mtm-product');
  const activityConfiguration = useActivityConfiguration('validate-mtm-product');
  const activityId = activityConfiguration?.id as ActivityId | undefined;
  useRuleValidator(activityId, rule);

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
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-mtm-product', statementIndex, attribute, value });
  };

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine helpUrl={useHelpUrl('PP_VMP_VALIDATE_INTERVAL_ALT')}>
        <CheckBox
          disabled={disabled}
          label={formatMessage({ id: 'rule.validate.mtm.product.stop.out.of.range' })}
          checked={validateMTMProduct.stopOnOutOfRangeWarning!}
          onChange={value => updateValidateMTMProduct('stopOnOutOfRangeWarning', value)}
          xlabel="stopOnOutOfRangeWarning"
          tickSize={13}
        />
      </FormLine>
      <FormLine helpUrl={useHelpUrl('PP_VMP_VALIDATE_STRICT_ALT')}>
        <CheckBox
          disabled={disabled}
          label={formatMessage({ id: 'rule.validate.mtm.product.stop.incorrect.value' })}
          checked={validateMTMProduct.stopOnIncorrectValueWarning!}
          onChange={value => updateValidateMTMProduct('stopOnIncorrectValueWarning', value)}
          xlabel="stopOnIncorrectValueWarning"
          tickSize={13}
        />
      </FormLine>
    </Form>
  );
};

export default ValidateMTMProductRule;
