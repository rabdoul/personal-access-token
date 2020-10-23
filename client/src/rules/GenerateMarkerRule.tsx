import React from 'react';
import Select from '@lectra/select';
import { useIntl } from 'react-intl';

import { LabelWithHelpTooltip } from '../base/Help';
import { StatementResult } from '../model';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';

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

const GenerateMarkerRule: React.FC = () => <Rule activityId={'generate-marker'}>{props => <GenerateMarkerForm {...props} />}</Rule>;

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
