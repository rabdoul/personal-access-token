import React from 'react';
import { useIntl } from 'react-intl';
import SpanTooltip from '@lectra/spantooltip';

import { StatementResult } from '../model';
import { ActivityId, useUIDispatch, useUIState } from '../UIState';
import useRule from './common/useRule';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { EfficiencyContainer, EfficiencyImg, EfficiencyNumbersContainer, Form, FormLine, FromInput, ToInput } from './common/styles';
import Rule from './common/Rule';
import { useHelpUrls } from '../base/Help';
import ErrorIcon from './common/ErrorIcon';
import useRuleValidator from './common/useRuleValidator';

export interface ValidateMarker extends StatementResult {
  efficiencyThresholdForManualValidation: number;
  efficiencyThresholdForAutomaticValidation: number;
}

const validateStatementResult = (result: Partial<ValidateMarker>) => {
  return isEfficiencyThresholdForManualValidationValid(result) && isEfficiencyThresholdForAutomaticValidationValid(result);
};

const isEfficiencyThresholdForManualValidationValid = (validateMarker: Partial<ValidateMarker>) => {
  return (
    validateMarker.efficiencyThresholdForManualValidation !== undefined &&
    validateMarker.efficiencyThresholdForManualValidation! >= 0 &&
    validateMarker.efficiencyThresholdForManualValidation! <= 100 &&
    validateMarker.efficiencyThresholdForManualValidation! <= validateMarker.efficiencyThresholdForAutomaticValidation!
  );
};

const isEfficiencyThresholdForAutomaticValidationValid = (validateMarker: Partial<ValidateMarker>) => {
  return (
    validateMarker.efficiencyThresholdForAutomaticValidation !== undefined &&
    validateMarker.efficiencyThresholdForAutomaticValidation! >= 0 &&
    validateMarker.efficiencyThresholdForAutomaticValidation! <= 100 &&
    validateMarker.efficiencyThresholdForAutomaticValidation! >= validateMarker.efficiencyThresholdForManualValidation!
  );
};

const ValidateMarkerRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('validate-marker');
  const activityConfiguration = useActivityConfiguration('validate-marker');
  const activityId = activityConfiguration?.id as ActivityId | undefined;

  useRuleValidator(activityId, rule, validateStatementResult);

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {(statementIndex, result) => <ValidateMarkerResultForm validateMarker={result} statementIndex={statementIndex} disabled={!editMode} />}
    </Rule>
  );
};

type FormProps = {
  validateMarker: Partial<ValidateMarker>;
  statementIndex: number;
  disabled: boolean;
};

const ValidateMarkerResultForm: React.FC<FormProps> = ({ validateMarker, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const updateMarkerValidation = (attribute: keyof ValidateMarker, value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-marker', statementIndex, attribute, value: parseInt(value) });
  };

  const urls = useHelpUrls('PP_VM_MARKER_VALIDATION');

  return (
    <Form>
      <FormLine helpUrl={urls[0]}>
        {formatMessage({ id: 'rule.validate.marker' })}
        <div style={{ margin: '0 20px 0 60px', alignSelf: 'start', paddingTop: '8px' }}>{formatMessage({ id: 'rule.validate.marker.efficiency' })}</div>
        <div data-xlabel="marker-validblock">
          <EfficiencyNumbersContainer>
            <SpanTooltip text={formatMessage({ id: 'rule.validate.marker.from' })} />
            <FromInput
              onBlur={evt => updateMarkerValidation('efficiencyThresholdForManualValidation', evt.target.value)}
              value={validateMarker.efficiencyThresholdForManualValidation}
              type="number"
              disabled={disabled}
              width={50}
              numberMaxDigits={0}
              min={0}
              data-xlabel="efficiency-lower-bound"
              error={!isEfficiencyThresholdForManualValidationValid(validateMarker)}
              icon={<ErrorIcon errorKey="rule.validate.marker.efficiency.must.be.lower" />}
            />
            <SpanTooltip text={formatMessage({ id: 'rule.validate.marker.to' })} />
            <ToInput
              onBlur={evt => updateMarkerValidation('efficiencyThresholdForAutomaticValidation', evt.target.value)}
              value={validateMarker.efficiencyThresholdForAutomaticValidation}
              type="number"
              disabled={disabled}
              width={50}
              numberMaxDigits={0}
              min={0}
              data-xlabel="efficiency-upper-bound"
              error={!isEfficiencyThresholdForAutomaticValidationValid(validateMarker)}
              icon={<ErrorIcon errorKey="rule.validate.marker.efficiency.must.be.lower" />}
            />
            %
          </EfficiencyNumbersContainer>
          <EfficiencyImg />
          <EfficiencyContainer>
            <div>{formatMessage({ id: 'rule.validate.marker.reject' })}</div>
            <div>{formatMessage({ id: 'rule.validate.marker.request' })}</div>
            <div>{formatMessage({ id: 'rule.validate.marker.validate' })}</div>
          </EfficiencyContainer>
        </div>
      </FormLine>
    </Form>
  );
};

export default ValidateMarkerRule;
