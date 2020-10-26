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
import { useUIDispatch } from '../UIState';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';
import { useAccessToken } from '../base/Authentication';

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

function useProximityRules(): { label: string; value: string; isMotifRule: boolean }[] {
  const token = useAccessToken();
  const { data: proximityRules } = useQuery('proximity-rules', () => fetchData(token, 'proximity-rules'));
  return proximityRules;
}

function useBlockingRules(): { label: string; value: string; isMotifRule: boolean }[] {
  const token = useAccessToken();
  const { data: blockingRules } = useQuery('blocking-rules', () => fetchData(token, 'blocking-rules'));
  return blockingRules;
}

function usePositionningRules() {
  const token = useAccessToken();
  const { data: positionningRules } = useQuery('positionning-rules', () => fetchData(token, 'positionning-rules'));
  return positionningRules;
}

const GenerateMarkerRule: React.FC = () => <Rule activityId={'generate-marker'}>{props => <GenerateMarkerForm {...props} />}</Rule>;

const GenerateMarkerForm: React.FC<StatementResultFormProps<GenerateMarker>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const proximityRules = useProximityRules() || [];
  const blockingRules = useBlockingRules() || [];
  const positionningRules = usePositionningRules() || [];

  const updateStatementResult = (attribute: keyof GenerateMarker, value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-marker', statementIndex, attribute, value });
  };

  const groupsProcessingItems = [
    { label: formatMessage({ id: 'rule.generate.marker.ignore' }), value: '1' },
    { label: formatMessage({ id: 'rule.generate.marker.spaceout' }), value: '2' },
    { label: formatMessage({ id: 'rule.generate.marker.interlock' }), value: '3' }
  ];

  const variantDirectionItems = [
    { label: formatMessage({ id: 'rule.generate.marker.normal.direction' }), value: '0' },
    { label: formatMessage({ id: 'rule.generate.marker.occurrences' }), value: '1' },
    { label: formatMessage({ id: 'rule.generate.marker.sizes' }), value: '2' }
  ];

  return (
    <div style={{ fontWeight: 'lighter' }}>
      <Form>
        <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.groups' })}</LabelWithHelpTooltip>
        <Line>
          <Select
            data-xlabel="markerGroups"
            value={statementResult.groupsProcessing?.toString()}
            listItems={groupsProcessingItems}
            onChange={item => updateStatementResult('groupsProcessing', parseInt(item.value))}
            width={200}
            disabled={disabled}
          />
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
        <Select
          data-xlabel="variantDirection"
          value={statementResult.variantDirection?.toString()}
          listItems={variantDirectionItems}
          onChange={item => updateStatementResult('variantDirection', parseInt(item.value))}
          width={200}
          disabled={disabled}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.proximity' })}</LabelWithHelpTooltip>: {formatMessage({ id: 'rule.generate.marker.plain.material' })}
        </div>
        <Line>
          <DropDownSearch
            data-xlabel="proximityRulesIdPlain"
            data-xvalue={statementResult.proximityRulesIdPlain ? statementResult.proximityRulesIdPlain : 'none'}
            listItems={proximityRules.filter(it => !it.isMotifRule)}
            value={statementResult.proximityRulesIdPlain}
            onChange={item => updateStatementResult('proximityRulesIdPlain', item.value)}
            customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => {}} />}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <DropDownSearch
            data-xlabel="proximityRulesIdMotif"
            data-xvalue={statementResult.proximityRulesIdMotif ? statementResult.proximityRulesIdMotif : 'none'}
            listItems={proximityRules.filter(it => it.isMotifRule)}
            value={statementResult.proximityRulesIdMotif}
            onChange={item => updateStatementResult('proximityRulesIdMotif', item.value)}
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
            listItems={blockingRules.filter(it => !it.isMotifRule)}
            value={statementResult.blockingRuleIdPlain}
            onChange={item => updateStatementResult('blockingRuleIdPlain', item.value)}
            customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => {}} />}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <DropDownSearch
            data-xlabel="blockingRuleIdMotif"
            data-xvalue={statementResult.blockingRuleIdMotif ? statementResult.blockingRuleIdMotif : 'none'}
            listItems={blockingRules.filter(it => it.isMotifRule)}
            value={statementResult.blockingRuleIdMotif}
            onChange={item => updateStatementResult('blockingRuleIdMotif', item.value)}
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
            listItems={positionningRules}
            value={statementResult.zonePositioningRuleIdPlain}
            onChange={item => updateStatementResult('zonePositioningRuleIdPlain', item.value)}
            customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => {}} />}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <DropDownSearch
            data-xlabel="zonePositioningRuleIdMotif"
            data-xvalue={statementResult.zonePositioningRuleIdMotif ? statementResult.zonePositioningRuleIdMotif : 'none'}
            listItems={positionningRules}
            value={statementResult.zonePositioningRuleIdMotif}
            onChange={item => updateStatementResult('zonePositioningRuleIdMotif', item.value)}
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
            onChange={({ value }) => updateStatementResult('usePreNesting', value === 'true')}
            disabled={disabled}
            options={{ items: { minWidth: 100 } }}
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
          onChange={({ value }) => updateStatementResult('useVariableSpacing', value === 'true')}
          disabled={disabled}
          options={{ items: { minWidth: 100 } }}
        />
      </Line>
    </div>
  );
};

export default GenerateMarkerRule;
