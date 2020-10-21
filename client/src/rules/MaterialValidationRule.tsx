import React from 'react';

import useRule from './common/useRule';
import { useUIDispatch, useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { StatementResult } from '../model';
import { Form, FormLine, StyledSelect } from './common/styles';
import { useIntl } from 'react-intl';
import useRuleValidator from './common/useRuleValidator';
import Checkbox from '@lectra/checkbox';

export interface MaterialValidation extends StatementResult {
  requestValidation: boolean;
  updateMaterialBatch: boolean;
  doNotAskAgain: boolean;
  requestPreRollAllocation: boolean;
}

const MaterialValidationRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('validate-marker-width');
  const activityConfiguration = useActivityConfiguration('validate-marker-width');
  useRuleValidator('validate-marker-width', rule);

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <ValidateMaterialResultForm {...props} />}
    </Rule>
  );
};

const ValidateMaterialResultForm: React.FC<StatementResultFormProps<MaterialValidation>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const requestValidationItems = [
    { label: formatMessage({ id: 'rule.material.validation.no.validation' }), value: 'no-validation' },
    { label: formatMessage({ id: 'rule.material.validation.request.validation' }), value: 'request-validation' },
    { label: formatMessage({ id: 'rule.material.validation.roll.pre-assignment' }), value: 'roll-pre-assignment' }
  ];

  let value = 'no-validation';
  if (statementResult.requestValidation) {
    value = 'request-validation';
  } else if (statementResult.requestPreRollAllocation) {
    value = 'roll-pre-assignment';
  }

  function handleRequestValidationChange(item: { value: string }) {
    let values = [false, false, false, false];
    if (item.value === 'request-validation') {
      values = [true, false, false, false];
    } else if (item.value === 'roll-pre-assignment') {
      values = [false, false, false, true];
    }
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-marker-width', statementIndex, attribute: 'requestValidation', value: values[0] });
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-marker-width', statementIndex, attribute: 'updateMaterialBatch', value: values[1] });
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-marker-width', statementIndex, attribute: 'doNotAskAgain', value: values[2] });
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-marker-width', statementIndex, attribute: 'requestPreRollAllocation', value: values[3] });
  }

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine>
        <StyledSelect listItems={requestValidationItems} value={value} onChange={handleRequestValidationChange} width={600} disabled={disabled} />
      </FormLine>
      {statementResult.requestValidation && (
        <FormLine>
          <Checkbox
            label={formatMessage({ id: 'rule.material.validation.auto.update' })}
            checked={statementResult.updateMaterialBatch!}
            onChange={value => dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-marker-width', statementIndex, attribute: 'updateMaterialBatch', value })}
            disabled={disabled}
            xlabel="updateMaterialBatch"
            tickSize={13}
          />
        </FormLine>
      )}
      {statementResult.updateMaterialBatch && (
        <FormLine>
          <Checkbox
            label={formatMessage({ id: 'rule.material.validation.do.not.ask.again' })}
            checked={statementResult.doNotAskAgain!}
            onChange={value => dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-marker-width', statementIndex, attribute: 'doNotAskAgain', value })}
            disabled={disabled}
            xlabel="doNotAskAgain"
            tickSize={13}
          />
        </FormLine>
      )}
    </Form>
  );
};

export default MaterialValidationRule;
