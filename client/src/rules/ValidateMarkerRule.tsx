import React from 'react';
import SpanTooltip from '@lectra/spantooltip';
import { useIntl } from 'react-intl';

import { LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import { StatementResult } from '../model';
import { useUIDispatch } from '../UIState';
import ErrorIcon from './common/ErrorIcon';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form, MarkerEfficiencyContainer, MarkerEfficiencyGauge, MarkerEfficiencyLabelContainer, MaxMarkerEfficiencyInput, MinMarkerEfficiencyInput } from './common/styles';

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

const ValidateMarkerRule = () => (
  <Rule activityId={'validate-marker'} validateStatementResult={validateStatementResult}>
    {props => <ValidateMarkerResultForm {...props} />}
  </Rule>
);

const ValidateMarkerResultForm: React.FC<StatementResultFormProps<ValidateMarker>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const updateMarkerValidation = (attribute: keyof ValidateMarker, value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-marker', statementIndex, attribute, value: parseInt(value) });
  };

  const urls = useHelpUrls('PP_VM_MARKER_VALIDATION');

  return (
    <Form style={{ display: 'flex' }}>
      <LabelWithHelpTooltip helpUrl={urls[0]}>{formatMessage({ id: 'rule.validate.marker' })}</LabelWithHelpTooltip>
      <div style={{ margin: '0 20px 0 60px', alignSelf: 'start', paddingTop: '8px' }}>{formatMessage({ id: 'rule.validate.marker.efficiency' })}</div>
      <div>
        <MarkerEfficiencyContainer>
          <SpanTooltip text={formatMessage({ id: 'rule.validate.marker.from' })} />
          <MinMarkerEfficiencyInput
            onChange={evt => updateMarkerValidation('efficiencyThresholdForManualValidation', evt.target.value)}
            value={statementResult.efficiencyThresholdForManualValidation}
            type="number"
            disabled={disabled}
            width={50}
            numberMaxDigits={0}
            min={0}
            data-xlabel="efficiency-lower-bound"
            error={!isEfficiencyThresholdForManualValidationValid(statementResult)}
            icon={<ErrorIcon errorKey="rule.validate.marker.efficiency.must.be.lower" />}
          />
          <SpanTooltip text={formatMessage({ id: 'rule.validate.marker.to' })} />
          <MaxMarkerEfficiencyInput
            onChange={evt => updateMarkerValidation('efficiencyThresholdForAutomaticValidation', evt.target.value)}
            value={statementResult.efficiencyThresholdForAutomaticValidation}
            type="number"
            disabled={disabled}
            width={50}
            numberMaxDigits={0}
            min={0}
            data-xlabel="efficiency-upper-bound"
            error={!isEfficiencyThresholdForAutomaticValidationValid(statementResult)}
            icon={<ErrorIcon errorKey="rule.validate.marker.efficiency.must.be.lower" />}
          />
          %
        </MarkerEfficiencyContainer>
        <MarkerEfficiencyGauge />
        <MarkerEfficiencyLabelContainer>
          <div>{formatMessage({ id: 'rule.validate.marker.reject' })}</div>
          <div>{formatMessage({ id: 'rule.validate.marker.request' })}</div>
          <div>{formatMessage({ id: 'rule.validate.marker.validate' })}</div>
        </MarkerEfficiencyLabelContainer>
      </div>
    </Form>
  );
};

export default ValidateMarkerRule;
