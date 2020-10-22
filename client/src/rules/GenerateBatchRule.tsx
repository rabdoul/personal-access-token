import React from 'react';
import { useIntl } from 'react-intl';
import CheckBox from '@lectra/checkbox';
import Input from '@lectra/input';
import Icon from '@lectra/icon';

import { StatementResult } from '../model';
import { ActivityId, useUIDispatch, useUIState } from '../UIState';
import useRule from './common/useRule';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { ButtonGroup, CriteriaLabel, CriterionsContainer, FormLabel, FormLine, Form, StyledSmallSelect, InputNumberWithError, SelectWithError } from './common/styles';
import useRuleValidator from './common/useRuleValidator';
import { MANDATORY_FIELD_ERROR } from './common/ErrorIcon';
import { ActionButton, useHelpUrls, withHelpTooltip } from '../base/Help';
import styled from 'styled-components/macro';

export type Criteria = Partial<{
  batchGenerationCriterionType: number;
  componentCategory: string;
  componentMaterialUsage: string;
  isContrast: boolean;
}>;

export interface GenerateBatch extends StatementResult {
  batchGenerationType: number;
  useMaxNumberOfOrder: boolean;
  maxNumberOfOrders: number;
  criterions?: Criteria[];
}

const isMaxNumberOfOrdersValid = (maxNumberOfOrders?: number) => {
  return maxNumberOfOrders !== undefined && maxNumberOfOrders > 0;
};

const isAllBatchGenerationCriterionTypeValid = (criterions: Criteria[]) => {
  const found = criterions.find(criteria => criteria.batchGenerationCriterionType === undefined);
  return found === undefined;
};

const isComponentMaterialUsageValid = (materialUsage?: string) => {
  return materialUsage !== undefined && materialUsage !== '';
};

const isAllComponentMaterialUsagesValid = (criterions: Criteria[]) => {
  const found = criterions.find(criteria => criteria.batchGenerationCriterionType === 0 && !isComponentMaterialUsageValid(criteria.componentMaterialUsage));
  return found === undefined;
};

const isCriterionsValid = (criterions?: Criteria[]) => {
  if (!criterions) {
    return true;
  } else {
    return isAllBatchGenerationCriterionTypeValid(criterions) && isAllComponentMaterialUsagesValid(criterions);
  }
};

const validateStatementResult = (result: Partial<GenerateBatch>) => {
  switch (result.batchGenerationType) {
    case 0: {
      if (result.useMaxNumberOfOrder) {
        return isMaxNumberOfOrdersValid(result.maxNumberOfOrders);
      }
      return true;
    }
    case 1:
      return isMaxNumberOfOrdersValid(result.maxNumberOfOrders) && isCriterionsValid(result.criterions);
    default:
      return false;
  }
};

const GenerateBatchRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('generate-batch');
  const activityConfiguration = useActivityConfiguration('generate-batch');
  const activityId = activityConfiguration?.id as ActivityId | undefined;
  useRuleValidator(activityId, rule, validateStatementResult);

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <GenerateBatchResultForm {...props} />}
    </Rule>
  );
};

const GenerateBatchResultForm: React.FC<StatementResultFormProps<GenerateBatch>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const urls = useHelpUrls('PP_GENERATE_BATCH_ORDERS_NUMBER_MAX', 'PP_GENERATE_BATCH_GROUP_BY_CRITERION');

  const updateGenerateBatch = (attribute: keyof GenerateBatch, value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-batch', statementIndex, attribute, value });
  };

  const updateCriterions = (value: number) => {
    if (value === 0) {
      dispatch({ type: 'REMOVE_ALL_CRITERIONS_GENERATE_BATCH', statementIndex });
    } else {
      dispatch({ type: 'ADD_CRITERIA_GENERATE_BATCH', statementIndex });
      updateGenerateBatch('useMaxNumberOfOrder', true);
    }
    updateGenerateBatch('batchGenerationType', value);
  };

  const groupOrdersPerCriteriaItems = [
    { label: formatMessage({ id: 'common.no' }), value: '0' },
    { label: formatMessage({ id: 'common.yes' }), value: '1' }
  ];

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine style={{ marginBottom: '10px' }} helpUrl={urls[0]}>
        <FormLabel>
          <CheckBox
            disabled={disabled}
            checked={statementResult.useMaxNumberOfOrder ? statementResult.useMaxNumberOfOrder : false}
            onChange={(value: any) => {
              if (statementResult.batchGenerationType === 0) updateGenerateBatch('useMaxNumberOfOrder', value);
            }}
            xlabel="enableMaxPO"
            tickSize={13}
            label={formatMessage({ id: 'rule.generate.batch.enable.max.po.batch' })}
          />
        </FormLabel>
        <InputNumberWithError
          onBlur={evt => updateGenerateBatch('maxNumberOfOrders', parseInt(evt.target.value))}
          value={statementResult.maxNumberOfOrders}
          type="number"
          disabled={disabled || !statementResult.useMaxNumberOfOrder}
          width={50}
          numberMaxDigits={0}
          min={0}
          data-xlabel="maxPOPerBatch"
          error={!isMaxNumberOfOrdersValid(statementResult.maxNumberOfOrders) && statementResult.useMaxNumberOfOrder!}
          icon={MANDATORY_FIELD_ERROR}
        />
      </FormLine>
      <FormLine helpUrl={urls[1]}>
        <FormLabel>{formatMessage({ id: 'rule.generate.batch.group.orders.criteria' })}</FormLabel>
        <StyledSmallSelect
          data-xlabel="groupOrderCriteria"
          listItems={groupOrdersPerCriteriaItems}
          onChange={({ value }) => updateCriterions(parseInt(value))}
          width={50}
          disabled={disabled}
          value={`${statementResult.batchGenerationType}`}
          error={statementResult.batchGenerationType === undefined}
          icon={MANDATORY_FIELD_ERROR}
        />
      </FormLine>
      {statementResult.criterions &&
        statementResult.criterions.map((criteria: Criteria, index: number) => {
          return (
            <CriterionsBlock
              key={`criteria-${index}`}
              disabled={disabled}
              criteriaIndex={index}
              criteria={criteria}
              criterionsLength={statementResult.criterions!.length}
              statementIndex={statementIndex}
            />
          );
        })}
    </Form>
  );
};

const CriterionsBlock: React.FC<{ disabled: boolean; criteriaIndex: number; criteria: Criteria; criterionsLength: number; statementIndex: number }> = ({
  disabled,
  criteriaIndex,
  criteria,
  criterionsLength,
  statementIndex
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const urls = useHelpUrls(
    'PP_GENERATE_BATCH_CRITERIA',
    'PP_GENERATE_BATCH_THEN_CRITERIA',
    'PP_GENERATE_BATCH_COMPONENT_CATEGORY',
    'PP_GENERATE_BATCH_MATERIAL_USAGE',
    'PP_GENERATE_BATCH_CONTRAST',
    'PP_GENERATE_BATCH_ADD_CRITERIA',
    'PP_GENERATE_BATCH_DELETE_CRITERIA'
  );

  const criteriaItems = [
    { label: formatMessage({ id: 'common.criteria.material' }), value: '0' },
    { label: formatMessage({ id: 'common.criteria.delivery.date' }), value: '1' },
    { label: formatMessage({ id: 'common.criteria.order.date' }), value: '2' }
  ];

  const updateCriteria = (attribute: keyof Criteria, value: any) => {
    dispatch({ type: 'UPDATE_CRITERIA_GENERATE_BATCH', statementIndex, criteriaIndex, attribute, value });
  };

  return (
    <CriterionsContainer data-xrow={criteriaIndex} data-xlabel="criterions">
      <FormLine style={{ marginBottom: '10px' }}>
        <CriteriaLabel helpUrl={urls[criteriaIndex === 0 ? 0 : 1]}>
          {formatMessage({ id: criteriaIndex === 0 ? 'rule.generate.batch.criteria' : 'rule.generate.batch.then.criteria' })}
        </CriteriaLabel>
        <SelectWithError
          data-xlabel="criteria"
          listItems={criteriaItems}
          onChange={item => updateCriteria('batchGenerationCriterionType', parseInt(item.value))}
          disabled={disabled}
          value={`${criteria.batchGenerationCriterionType}`}
          width={120}
          error={criteria.batchGenerationCriterionType === undefined}
          icon={MANDATORY_FIELD_ERROR}
        />
        <ButtonGroup>
          <ActionButton disabled={disabled} toggled={false} type="white" onClick={() => dispatch({ type: 'ADD_CRITERIA_GENERATE_BATCH', statementIndex })} helpUrl={urls[5]}>
            <Icon type="add" />
          </ActionButton>
          <ActionButton
            disabled={disabled || criterionsLength === 1}
            toggled={false}
            type="white"
            onClick={() => dispatch({ type: 'DELETE_CRITERIA_GENERATE_BATCH', statementIndex, criteriaIndex })}
            helpUrl={urls[6]}
          >
            <Icon type="delete" />
          </ActionButton>
        </ButtonGroup>
      </FormLine>
      {criteria.batchGenerationCriterionType === 0 && (
        <>
          <FormLine style={{ marginBottom: '10px' }}>
            <CriteriaLabel helpUrl={urls[2]}>{formatMessage({ id: 'rule.generate.batch.component.category' })}</CriteriaLabel>
            <Input
              onBlur={evt => updateCriteria('componentCategory', evt.target.value)}
              value={criteria.componentCategory}
              type="text"
              disabled={disabled}
              width={200}
              data-xlabel="componentCategory"
            />
            <ContrastCheckbox helpUrl={urls[4]}>
              <CheckBox
                disabled={disabled}
                checked={criteria.isContrast ? criteria.isContrast : false}
                onChange={value => updateCriteria('isContrast', value)}
                xlabel="withContrast"
                tickSize={13}
                label={formatMessage({ id: 'rule.generate.batch.contrast' })}
              />
            </ContrastCheckbox>
          </FormLine>
          <FormLine>
            <CriteriaLabel helpUrl={urls[3]}>{formatMessage({ id: 'rule.generate.batch.material.usage' })}</CriteriaLabel>
            <Input
              onBlur={evt => updateCriteria('componentMaterialUsage', evt.target.value)}
              value={criteria.componentMaterialUsage}
              type="text"
              disabled={disabled}
              width={200}
              data-xlabel="materialUsage"
              error={!isComponentMaterialUsageValid(criteria.componentMaterialUsage)}
              icon={MANDATORY_FIELD_ERROR}
            />
          </FormLine>
        </>
      )}
    </CriterionsContainer>
  );
};

export default GenerateBatchRule;

const ContrastCheckbox = withHelpTooltip(styled.div`
  margin-left: 20px;
`);
