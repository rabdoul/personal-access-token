import React from 'react';

import useRule from './common/useRule';
import { StatementResult } from '../model';
import { useUIDispatch, useUIState } from '../UIState';
import { useIntl } from 'react-intl';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { Form } from './common/styles';
import Rule, { StatementResultFormProps } from './common/Rule';
import useRuleValidator from './common/useRuleValidator';
import { CheckBoxWithHelpTooltip, useHelpUrls } from '../base/Help';

export interface ValidateMTMProduct extends StatementResult {
  stopOnOutOfRangeWarning: boolean;
  stopOnIncorrectValueWarning: boolean;
}

const ValidateMTMProductRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('validate-mtm-product');
  const activityConfiguration = useActivityConfiguration('validate-mtm-product');
  useRuleValidator('validate-mtm-product', rule);

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <ValidateMTMProductResultForm {...props} />}
    </Rule>
  );
};

const ValidateMTMProductResultForm: React.FC<StatementResultFormProps<ValidateMTMProduct>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const updateValidateMTMProduct = (attribute: keyof ValidateMTMProduct, value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-mtm-product', statementIndex, attribute, value });
  };

  const urls = useHelpUrls('PP_VMP_VALIDATE_INTERVAL_ALT', 'PP_VMP_VALIDATE_STRICT_ALT');

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <CheckBoxWithHelpTooltip
        disabled={disabled}
        label={formatMessage({ id: 'rule.validate.mtm.product.stop.out.of.range' })}
        checked={statementResult.stopOnOutOfRangeWarning!}
        onChange={value => updateValidateMTMProduct('stopOnOutOfRangeWarning', value)}
        xlabel="stopOnOutOfRangeWarning"
        tickSize={13}
        helpUrl={urls[0]}
      />
      <br />
      <CheckBoxWithHelpTooltip
        disabled={disabled}
        label={formatMessage({ id: 'rule.validate.mtm.product.stop.incorrect.value' })}
        checked={statementResult.stopOnIncorrectValueWarning!}
        onChange={value => updateValidateMTMProduct('stopOnIncorrectValueWarning', value)}
        xlabel="stopOnIncorrectValueWarning"
        tickSize={13}
        helpUrl={urls[1]}
      />
    </Form>
  );
};

export default ValidateMTMProductRule;
