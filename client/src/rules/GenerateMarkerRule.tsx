import React from 'react';
import { useIntl } from 'react-intl';
import Input from '@lectra/input';
import ItemsSwitcher from '@lectra/itemsswitcher';
import Select from '@lectra/select';

import Rule, { StatementResultFormProps } from './common/Rule';
import { Form, Line } from './common/styles';
import { LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import { StatementResult } from '../model';
import DropDownSearchRenderer from './common/DropDownSearchRenderer';
import DropDownSearch from '@lectra/dropdownsearch';
import { useUIDispatch } from '../UIState';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';
import { useAccessToken } from '../base/Authentication';
import { MANDATORY_FIELD_ERROR } from './common/ErrorIcon';
import InputLength from './common/InputLength';
import useUnitConfig from './common/useUnitConfig';

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

function usePositioningRules() {
  const token = useAccessToken();
  const { data: positioningRules } = useQuery('positioning-rules', () => fetchData(token, 'positioning-rules'));
  return positioningRules;
}

const validateStatementResult = (result: Partial<GenerateMarker>) => {
  if (result.groupsProcessing !== undefined && result.variantDirection !== undefined) {
    if (result.groupsProcessing === 1) {
      if (result.usePreNesting && result.preNestedAnalyticCodes) {
        return result.preNestedAnalyticCodes.length > 0;
      } else if (result.usePreNesting && !result.preNestedAnalyticCodes) {
        return false;
      }
      return true;
    } else {
      if (result.usePreNesting && result.preNestedAnalyticCodes) {
        return result.preNestedAnalyticCodes.length > 0 && result.processingValue! >= 0 && result.processingValue !== undefined;
      } else if (result.usePreNesting && !result.preNestedAnalyticCodes) {
        return false;
      }
      return result.processingValue! >= 0 && result.processingValue !== undefined;
    }
  }
  return false;
};

const GenerateMarkerRule: React.FC = () => (
  <Rule activityId={'generate-marker'} validateStatementResult={validateStatementResult}>
    {props => <GenerateMarkerForm {...props} />}
  </Rule>
);

const GenerateMarkerForm: React.FC<StatementResultFormProps<GenerateMarker>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const urls = useHelpUrls(
    'PP_GENERATE_MARKER_GROUPS',
    'PP_GENERATE_MARKER_DISTANCE',
    'PP_GENERATE_MARKER_VARIANT_DIRECTION',
    'PP_GENERATE_MARKER_PROXIMITY',
    'PP_GENERATE_MARKER_PROXIMITY_MOTIF',
    'PP_GENERATE_MARKER_BLOCKING',
    'PP_GENERATE_MARKER_BLOCKING_MOTIF',
    'PP_GENERATE_MARKER_POSITIONING',
    'PP_GENERATE_MARKER_POSITIONING_MOTIF',
    'PP_GENERATE_MARKER_PRE_NESTING',
    'PP_GENERATE_MARKER_PRE_NESTING_CODES',
    'PP_GENERATE_MARKER_GAP_MOTIF_STEP'
  );

  const proximityRules = useProximityRules() || [];
  const blockingRules = useBlockingRules() || [];
  const positioningRules = usePositioningRules() || [];

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

  const distanceUnitConfig = useUnitConfig('GroupsProcessing');

  return (
    <div style={{ fontWeight: 'lighter' }}>
      <Form>
        <LabelWithHelpTooltip helpUrl={urls[0]}>{formatMessage({ id: 'rule.generate.marker.groups' })}</LabelWithHelpTooltip>
        <Line>
          <Select
            data-xlabel="markerGroups"
            value={statementResult.groupsProcessing?.toString()}
            listItems={groupsProcessingItems}
            onChange={item => updateStatementResult('groupsProcessing', parseInt(item.value))}
            width={200}
            disabled={disabled}
            error={statementResult.groupsProcessing === undefined}
            icon={MANDATORY_FIELD_ERROR}
          />
          {statementResult.groupsProcessing !== 1 && statementResult.groupsProcessing && (
            <>
              <LabelWithHelpTooltip helpUrl={urls[1]}>{formatMessage({ id: 'rule.generate.marker.distance' })}</LabelWithHelpTooltip>
              <InputLength
                targetUnit={distanceUnitConfig.unit}
                disabled={disabled}
                decimalScale={distanceUnitConfig.decimalScale}
                onValueUpdate={value => updateStatementResult('processingValue', value)}
                width={60}
                xlabel="distance"
                valueInMeter={statementResult.processingValue}
                errorKey="rule.generate.marker.value.must.be.greater"
                min={0}
              />
            </>
          )}
        </Line>
        <LabelWithHelpTooltip helpUrl={urls[2]}>{formatMessage({ id: 'rule.generate.marker.variant.direction' })}</LabelWithHelpTooltip>
        <Select
          data-xlabel="variantDirection"
          value={statementResult.variantDirection?.toString()}
          listItems={variantDirectionItems}
          onChange={item => updateStatementResult('variantDirection', parseInt(item.value))}
          width={200}
          disabled={disabled}
          error={statementResult.variantDirection === undefined}
          icon={MANDATORY_FIELD_ERROR}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LabelWithHelpTooltip helpUrl={urls[3]}>{formatMessage({ id: 'rule.generate.marker.proximity' })}</LabelWithHelpTooltip>:{' '}
          {formatMessage({ id: 'rule.generate.marker.plain.material' })}
        </div>
        <Line>
          <DropDownSearch
            data-xlabel="proximityRulesIdPlain"
            data-xvalue={statementResult.proximityRulesIdPlain ? statementResult.proximityRulesIdPlain : 'none'}
            listItems={proximityRules.filter(it => !it.isMotifRule)}
            value={statementResult.proximityRulesIdPlain}
            onChange={item => updateStatementResult('proximityRulesIdPlain', item.value)}
            customRenderSelection={(item: any) => (
              <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => updateStatementResult('proximityRulesIdPlain', undefined)} />
            )}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
          <LabelWithHelpTooltip helpUrl={urls[4]}>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <DropDownSearch
            data-xlabel="proximityRulesIdMotif"
            data-xvalue={statementResult.proximityRulesIdMotif ? statementResult.proximityRulesIdMotif : 'none'}
            listItems={proximityRules.filter(it => it.isMotifRule)}
            value={statementResult.proximityRulesIdMotif}
            onChange={item => updateStatementResult('proximityRulesIdMotif', item.value)}
            customRenderSelection={(item: any) => (
              <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => updateStatementResult('proximityRulesIdMotif', undefined)} />
            )}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
        </Line>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LabelWithHelpTooltip helpUrl={urls[5]}>{formatMessage({ id: 'rule.generate.marker.blocking' })}</LabelWithHelpTooltip>:{' '}
          {formatMessage({ id: 'rule.generate.marker.plain.material' })}
        </div>
        <Line>
          <DropDownSearch
            data-xlabel="blockingRuleIdPlain"
            data-xvalue={statementResult.blockingRuleIdPlain ? statementResult.blockingRuleIdPlain : 'none'}
            listItems={blockingRules.filter(it => !it.isMotifRule)}
            value={statementResult.blockingRuleIdPlain}
            onChange={item => updateStatementResult('blockingRuleIdPlain', item.value)}
            customRenderSelection={(item: any) => (
              <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => updateStatementResult('blockingRuleIdPlain', undefined)} />
            )}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
          <LabelWithHelpTooltip helpUrl={urls[6]}>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <DropDownSearch
            data-xlabel="blockingRuleIdMotif"
            data-xvalue={statementResult.blockingRuleIdMotif ? statementResult.blockingRuleIdMotif : 'none'}
            listItems={blockingRules.filter(it => it.isMotifRule)}
            value={statementResult.blockingRuleIdMotif}
            onChange={item => updateStatementResult('blockingRuleIdMotif', item.value)}
            customRenderSelection={(item: any) => (
              <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => updateStatementResult('blockingRuleIdMotif', undefined)} />
            )}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
        </Line>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LabelWithHelpTooltip helpUrl={urls[7]}>{formatMessage({ id: 'rule.generate.marker.positioning' })}</LabelWithHelpTooltip>:{' '}
          {formatMessage({ id: 'rule.generate.marker.plain.material' })}
        </div>
        <Line>
          <DropDownSearch
            data-xlabel="zonePositioningRuleIdPlain"
            data-xvalue={statementResult.zonePositioningRuleIdPlain ? statementResult.zonePositioningRuleIdPlain : 'none'}
            listItems={positioningRules}
            value={statementResult.zonePositioningRuleIdPlain}
            onChange={item => updateStatementResult('zonePositioningRuleIdPlain', item.value)}
            customRenderSelection={(item: any) => (
              <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => updateStatementResult('zonePositioningRuleIdPlain', undefined)} />
            )}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
          <LabelWithHelpTooltip helpUrl={urls[8]}>{formatMessage({ id: 'rule.generate.marker.motif.material' })}</LabelWithHelpTooltip>
          <DropDownSearch
            data-xlabel="zonePositioningRuleIdMotif"
            data-xvalue={statementResult.zonePositioningRuleIdMotif ? statementResult.zonePositioningRuleIdMotif : 'none'}
            listItems={positioningRules}
            value={statementResult.zonePositioningRuleIdMotif}
            onChange={item => updateStatementResult('zonePositioningRuleIdMotif', item.value)}
            customRenderSelection={(item: any) => (
              <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => updateStatementResult('zonePositioningRuleIdMotif', undefined)} />
            )}
            disabled={disabled}
            placeholder="Search"
            width={200}
          />
        </Line>
        <LabelWithHelpTooltip helpUrl={urls[9]}>{formatMessage({ id: 'rule.generate.marker.pre.nesting' })}</LabelWithHelpTooltip>
        <Line>
          <ItemsSwitcher
            name="preNesting"
            items={[
              { title: formatMessage({ id: 'common.yes' }), value: 'true' },
              { title: formatMessage({ id: 'common.no' }), value: 'false' }
            ]}
            defaultValue={statementResult.usePreNesting ? statementResult.usePreNesting.toString() : 'false'}
            onChange={({ value }) => updateStatementResult('usePreNesting', value === 'true')}
            disabled={disabled}
            options={{ items: { minWidth: 20 } }}
          />
          {statementResult.usePreNesting && (
            <>
              <LabelWithHelpTooltip helpUrl={urls[10]}>{formatMessage({ id: 'rule.generate.marker.analytical.codes' })}</LabelWithHelpTooltip>
              <Input
                data-xlabel="analyticalCodes"
                name="analyticalCodes"
                onBlur={({ target: { value } }) => updateStatementResult('preNestedAnalyticCodes', value !== '' ? value.split(/[ ,]+/) : [])}
                type="text"
                value={statementResult.preNestedAnalyticCodes ? statementResult.preNestedAnalyticCodes.join() : undefined}
                disabled={disabled}
                width={200}
                error={
                  (statementResult.usePreNesting && statementResult.preNestedAnalyticCodes && statementResult.preNestedAnalyticCodes.length === 0) ||
                  (statementResult.usePreNesting && !statementResult.preNestedAnalyticCodes)
                }
                icon={MANDATORY_FIELD_ERROR}
              />
            </>
          )}
        </Line>
      </Form>
      <Line style={{ marginTop: '10px' }}>
        <LabelWithHelpTooltip helpUrl={urls[11]}>{formatMessage({ id: 'rule.generate.marker.gap.pieces' })}</LabelWithHelpTooltip>
        <ItemsSwitcher
          name="variableSpacing"
          items={[
            { title: formatMessage({ id: 'common.yes' }), value: 'true' },
            { title: formatMessage({ id: 'common.no' }), value: 'false' }
          ]}
          defaultValue={statementResult.useVariableSpacing?.toString() ?? 'false'}
          onChange={({ value }) => updateStatementResult('useVariableSpacing', value === 'true')}
          disabled={disabled}
          options={{ items: { minWidth: 20 } }}
        />
      </Line>
    </div>
  );
};

export default GenerateMarkerRule;
