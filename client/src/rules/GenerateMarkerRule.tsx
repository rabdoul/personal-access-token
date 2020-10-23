import React from 'react';
import { useIntl } from 'react-intl';
import useActivityConfiguration from '../activities/useActivityConfiguration';

import Select from '@lectra/select';
import { useUIState, ActivityId } from '../UIState';
import { LabelWithHelpTooltip } from '../base/Help';
import StepDescription from './common/StepDescription';
import useRule from './common/useRule';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';
import useRuleValidator from './common/useRuleValidator';
import { StatementResult } from '../model';

export interface GenerateMarker extends StatementResult {
  groupsProcessing: number;
  processingValue: number;
  variantDirection: number;
  proximityRulesIdPlain: string;
  proximityRulesIdMotif: string;
  blockingRuleIdPlain: string;
  blockingRuleIdMotif: string;
  zonePositioningRuleIdPlain: string;
  zonePositioningRuleIdMotif: string;
  usePreNesting: boolean;
  preNestedAnalyticCodes: string[];
  useVariableSpacing: boolean;
}

const GenerateMarkerRule: React.FC = () => {
  const generateMarker = useRule('generate-marker');
  const activityConfiguration = useActivityConfiguration('generate-marker');
  const { editMode } = useUIState();
  useRuleValidator(activityConfiguration?.id as ActivityId | undefined, generateMarker);
  if (generateMarker !== undefined && activityConfiguration !== undefined) {
    return (
      <Rule disabled={!editMode} activityConfiguration={activityConfiguration} rule={generateMarker}>
        {props => <GenerateMarkerForm {...props} />}
      </Rule>
    );
  } else {
    return <StepDescription />;
  }
};

const GenerateMarkerForm: React.FC<StatementResultFormProps<GenerateMarker>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();

  return (
    <Form>
      <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.groups' })}</LabelWithHelpTooltip>
      <Select data-xlabel="" listItems={[]} onChange={() => {}} width={150} disabled={disabled} />
    </Form>
  );
};

export default GenerateMarkerRule;
