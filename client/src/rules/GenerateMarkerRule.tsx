import React from 'react';
import { useIntl } from 'react-intl';
import Input from '@lectra/input';
import ItemsSwitcher from '@lectra/itemsswitcher';
import Select from '@lectra/select';

import Rule, { StatementResultFormProps } from './common/Rule';
import { Form, Line } from './common/styles';
import { LabelWithHelpTooltip } from '../base/Help';
import { StatementResult } from '../model';
import DropDownSearchRenderer from './common/DropDownSearchRenderer';
import DropDownSearch from '@lectra/dropdownsearch';

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
    <div style={{ fontWeight: 'lighter' }}>
      <Form>
        <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.groups' })}</LabelWithHelpTooltip>
        <Line>
          <Select data-xlabel="markerGroups" value={statementResult.groupsProcessing?.toString()} listItems={[]} onChange={() => {}} width={200} disabled={disabled} />
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
        <Select data-xlabel="variantDirection" value={statementResult.variantDirection?.toString()} listItems={[]} onChange={() => {}} width={200} disabled={disabled} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.proximity' })}</LabelWithHelpTooltip>: {formatMessage({ id: 'rule.generate.marker.plain.material' })}
        </div>
        <Line>
          <DropDownSearch
            data-xlabel="proximityRulesIdPlain"
            data-xvalue={statementResult.proximityRulesIdPlain ? statementResult.proximityRulesIdPlain : 'none'}
            listItems={[]}
            value={statementResult.proximityRulesIdPlain}
            onChange={() => {}}
            customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => {}} />}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <DropDownSearch
            data-xlabel="proximityRulesIdMotif"
            data-xvalue={statementResult.proximityRulesIdMotif ? statementResult.proximityRulesIdMotif : 'none'}
            listItems={[]}
            value={statementResult.proximityRulesIdMotif}
            onChange={() => {}}
            customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => {}} />}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
        </Line>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.blocking' })}</LabelWithHelpTooltip>: {formatMessage({ id: 'rule.generate.marker.plain.material' })}
        </div>
        <Line>
          <DropDownSearch
            data-xlabel="blockingRuleIdPlain"
            data-xvalue={statementResult.blockingRuleIdPlain ? statementResult.blockingRuleIdPlain : 'none'}
            listItems={[]}
            value={statementResult.blockingRuleIdPlain}
            onChange={() => {}}
            customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => {}} />}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <DropDownSearch
            data-xlabel="blockingRuleIdMotif"
            data-xvalue={statementResult.blockingRuleIdMotif ? statementResult.blockingRuleIdMotif : 'none'}
            listItems={[]}
            value={statementResult.blockingRuleIdMotif}
            onChange={() => {}}
            customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => {}} />}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
        </Line>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.positioning' })}</LabelWithHelpTooltip>: {formatMessage({ id: 'rule.generate.marker.plain.material' })}
        </div>
        <Line>
          <DropDownSearch
            data-xlabel="zonePositioningRuleIdPlain"
            data-xvalue={statementResult.zonePositioningRuleIdPlain ? statementResult.zonePositioningRuleIdPlain : 'none'}
            listItems={[]}
            value={statementResult.zonePositioningRuleIdPlain}
            onChange={() => {}}
            customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => {}} />}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <DropDownSearch
            data-xlabel="zonePositioningRuleIdMotif"
            data-xvalue={statementResult.zonePositioningRuleIdMotif ? statementResult.zonePositioningRuleIdMotif : 'none'}
            listItems={[]}
            value={statementResult.zonePositioningRuleIdMotif}
            onChange={() => {}}
            customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => {}} />}
            disabled={disabled}
            placeholder="Search"
            width={200}
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
                minWidth: 100
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
                width={200}
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
              minWidth: 100
            }
          }}
        />
      </Line>
    </div>
  );
};

export default GenerateMarkerRule;
