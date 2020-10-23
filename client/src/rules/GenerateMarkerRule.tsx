import React from 'react';
import { useIntl } from 'react-intl';
import Input from '@lectra/input';
import ItemsSwitcher from '@lectra/itemsswitcher';
import Select from '@lectra/select';

import useActivityConfiguration from '../activities/useActivityConfiguration';
import { useUIState } from '../UIState';
import { LabelWithHelpTooltip } from '../base/Help';
import StepDescription from './common/StepDescription';
import useRule from './common/useRule';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form, Line } from './common/styles';
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
    <div style={{ fontWeight: 'lighter' }}>
      <Form>
        <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.groups' })}</LabelWithHelpTooltip>
        <Line>
          <Select data-xlabel="markerGroups" value={statementResult.groupsProcessing?.toString()} listItems={[]} onChange={() => {}} width={150} disabled={disabled} />
          {statementResult.groupsProcessing !== 1 && (
            <>
              <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.distance' })}</LabelWithHelpTooltip>
              <Input
                data-xlabel="distance"
                name="distance"
                onBlur={({ target: { value } }) => {}}
                type="number"
                min={0}
                value={statementResult.processingValue}
                disabled={disabled}
                width={60}
              />
            </>
          )}
        </Line>
        <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.variant.direction' })}</LabelWithHelpTooltip>
        <Select data-xlabel="variantDirection" value={statementResult.variantDirection?.toString()} listItems={[]} onChange={() => {}} width={150} disabled={disabled} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.proximity' })}</LabelWithHelpTooltip>: {formatMessage({ id: 'rule.generate.marker.plain.material' })}
        </div>
        <Line>
          <Select
            data-xlabel="proximityRulesIdPlain"
            value={statementResult.proximityRulesIdPlain?.toString()}
            listItems={[]}
            onChange={() => {}}
            width={150}
            disabled={disabled}
          />
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <Select
            data-xlabel="proximityRulesIdMotif"
            value={statementResult.proximityRulesIdMotif?.toString()}
            listItems={[]}
            onChange={() => {}}
            width={150}
            disabled={disabled}
          />
        </Line>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.blocking' })}</LabelWithHelpTooltip>: {formatMessage({ id: 'rule.generate.marker.plain.material' })}
        </div>
        <Line>
          <Select data-xlabel="blockingRuleIdPlain" value={statementResult.blockingRuleIdPlain?.toString()} listItems={[]} onChange={() => {}} width={150} disabled={disabled} />
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <Select data-xlabel="blockingRuleIdMotif" value={statementResult.blockingRuleIdMotif?.toString()} listItems={[]} onChange={() => {}} width={150} disabled={disabled} />
        </Line>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.positioning' })}</LabelWithHelpTooltip>: {formatMessage({ id: 'rule.generate.marker.plain.material' })}
        </div>
        <Line>
          <Select
            data-xlabel="zonePositioningRuleIdPlain"
            value={statementResult.zonePositioningRuleIdPlain?.toString()}
            listItems={[]}
            onChange={() => {}}
            width={150}
            disabled={disabled}
          />
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <Select
            data-xlabel="zonePositioningRuleIdMotif"
            value={statementResult.zonePositioningRuleIdMotif?.toString()}
            listItems={[]}
            onChange={() => {}}
            width={150}
            disabled={disabled}
          />
        </Line>
        <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.pre.nesting' })}</LabelWithHelpTooltip>
        <Line>
          <ItemsSwitcher
            name="preNesting"
            items={[
              { title: formatMessage({ id: 'common.yes' }), value: 'true' },
              { title: formatMessage({ id: 'common.no' }), value: 'false' }
            ]}
            defaultValue={statementResult.usePreNesting?.toString() ?? 'false'}
            onChange={() => {}}
            disabled={disabled}
            options={{
              items: {
                minWidth: 76
              }
            }}
          />
          {statementResult.usePreNesting && (
            <>
              <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.analytical.codes' })}</LabelWithHelpTooltip>
              <Input
                data-xlabel="analyticalCodes"
                name="analyticalCodes"
                onBlur={({ target: { value } }) => {}}
                type="text"
                value={statementResult.preNestedAnalyticCodes ? statementResult.preNestedAnalyticCodes.join() : undefined}
                disabled={disabled}
                width={150}
              />
            </>
          )}
        </Line>
      </Form>
      <Line style={{ marginTop: '10px' }}>
        <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.gap.pieces' })}</LabelWithHelpTooltip>
        <ItemsSwitcher
          name="variableSpacing"
          items={[
            { title: formatMessage({ id: 'common.yes' }), value: 'true' },
            { title: formatMessage({ id: 'common.no' }), value: 'false' }
          ]}
          defaultValue={statementResult.useVariableSpacing?.toString() ?? 'false'}
          onChange={() => {}}
          disabled={disabled}
          options={{
            items: {
              minWidth: 76
            }
          }}
        />
      </Line>
    </div>
  );
};

export default GenerateMarkerRule;
