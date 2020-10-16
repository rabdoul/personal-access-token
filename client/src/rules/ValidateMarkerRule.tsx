import React from 'react';
import { useIntl } from 'react-intl';
import SpanTooltip from '@lectra/spantooltip';

import { StatementResult } from '../model';
import { useUIState } from '../UIState';
import useRule from './common/useRule';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import { EfficiencyContainer, EfficiencyImg, EfficiencyNumbersContainer, Form, FormLine, FromInput, ToInput } from './common/styles';
import Rule from './common/Rule';
import { useHelpUrls } from '../base/Help';

export interface ValidateMarker extends StatementResult {
  efficiencyThresholdForManualValidation: number;
  efficiencyThresholdForAutomaticValidation: number;
}

const ValidateMarkerRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('validate-marker');
  const activityConfiguration = useActivityConfiguration('validate-marker');
  // const activityId = activityConfiguration?.id as ActivityId | undefined;

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
  // const dispatch = useUIDispatch();

  // const updateMarkerValidation = (attribute: keyof ValidateMarker, value: any) => {
  //   dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'validate-marker', statementIndex, attribute, value });
  // };

  const urls = useHelpUrls('PP_VM_MARKER_VALIDATION');

  return (
    <Form>
      <FormLine helpUrl={urls[0]}>
        {formatMessage({ id: 'rule.validate.marker' })}
        <div style={{ margin: '0 20px 0 60px', alignSelf: 'start', paddingTop: '8px' }}>{formatMessage({ id: 'rule.validate.marker.efficiency' })}</div>
        <div>
          <EfficiencyNumbersContainer>
            <SpanTooltip text={formatMessage({ id: 'rule.validate.marker.from' })} />
            <FromInput value={validateMarker.efficiencyThresholdForManualValidation} type="number" width={50} numberMaxDigits={0} min={0} />
            <SpanTooltip text={formatMessage({ id: 'rule.validate.marker.to' })} />
            <ToInput value={validateMarker.efficiencyThresholdForAutomaticValidation} type="number" width={50} numberMaxDigits={0} min={0} />%
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
