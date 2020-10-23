import React, { Fragment } from 'react';
import Icon from '@lectra/icon';
import Input from '@lectra/input';
import { useIntl } from 'react-intl';

import { ButtonWithHelpTooltip, CheckBoxWithHelpTooltip, LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import { StatementResult } from '../model';
import { useUIDispatch } from '../UIState';
import { MANDATORY_FIELD_ERROR } from './common/ErrorIcon';
import Rule, { StatementResultFormProps } from './common/Rule';
import { ButtonGroup, CriterionsContainer, Form, InputNumberWithError, SelectWithError, StyledSmallSelect } from './common/styles';

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

const GenerateBatchRule = () => (
  <Rule activityId={'generate-batch'} validateStatementResult={validateStatementResult}>
    {props => <GenerateBatchResultForm {...props} />}
  </Rule>
);

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
    <div>
      <Form onSubmit={e => e.preventDefault()}>
        <CheckBoxWithHelpTooltip
          disabled={disabled}
          checked={statementResult.useMaxNumberOfOrder ? statementResult.useMaxNumberOfOrder : false}
          onChange={(value: any) => {
            if (statementResult.batchGenerationType === 0) updateGenerateBatch('useMaxNumberOfOrder', value);
          }}
          xlabel="enableMaxPO"
          tickSize={13}
          label={formatMessage({ id: 'rule.generate.batch.enable.max.po.batch' })}
          helpUrl={urls[0]}
        />
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
        <LabelWithHelpTooltip helpUrl={urls[1]}>{formatMessage({ id: 'rule.generate.batch.group.orders.criteria' })}</LabelWithHelpTooltip>
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
      </Form>
      {statementResult.criterions &&
        statementResult.criterions.map((criteria: Criteria, index: number) => {
          return (
            <Criterions
              key={`criteria-${index}`}
              disabled={disabled}
              criteriaIndex={index}
              criteria={criteria}
              criterionsLength={statementResult.criterions!.length}
              statementIndex={statementIndex}
            />
          );
        })}
    </div>
  );
};

type CriterionsProps = { disabled: boolean; criteriaIndex: number; criteria: Criteria; criterionsLength: number; statementIndex: number };

const Criterions: React.FC<CriterionsProps> = ({ disabled, criteriaIndex, criteria, criterionsLength, statementIndex }) => {
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
      <LabelWithHelpTooltip helpUrl={urls[criteriaIndex === 0 ? 0 : 1]}>
        {formatMessage({ id: criteriaIndex === 0 ? 'rule.generate.batch.criteria' : 'rule.generate.batch.then.criteria' })}
      </LabelWithHelpTooltip>
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
        <ButtonWithHelpTooltip disabled={disabled} toggled={false} type="white" onClick={() => dispatch({ type: 'ADD_CRITERIA_GENERATE_BATCH', statementIndex })} helpUrl={urls[5]}>
          <Icon type="add" />
        </ButtonWithHelpTooltip>
        <ButtonWithHelpTooltip
          disabled={disabled || criterionsLength === 1}
          toggled={false}
          type="white"
          onClick={() => dispatch({ type: 'DELETE_CRITERIA_GENERATE_BATCH', statementIndex, criteriaIndex })}
          helpUrl={urls[6]}
        >
          <Icon type="delete" />
        </ButtonWithHelpTooltip>
      </ButtonGroup>
      {criteria.batchGenerationCriterionType === 0 && (
        <Fragment>
          <LabelWithHelpTooltip helpUrl={urls[2]}>{formatMessage({ id: 'rule.generate.batch.component.category' })}</LabelWithHelpTooltip>
          <Input
            onBlur={evt => updateCriteria('componentCategory', evt.target.value)}
            value={criteria.componentCategory}
            type="text"
            disabled={disabled}
            width={200}
            data-xlabel="componentCategory"
          />
          <CheckBoxWithHelpTooltip
            disabled={disabled}
            checked={criteria.isContrast ? criteria.isContrast : false}
            onChange={value => updateCriteria('isContrast', value)}
            xlabel="withContrast"
            tickSize={13}
            label={formatMessage({ id: 'rule.generate.batch.contrast' })}
            helpUrl={urls[4]}
          />
          <LabelWithHelpTooltip helpUrl={urls[3]}>{formatMessage({ id: 'rule.generate.batch.material.usage' })}</LabelWithHelpTooltip>
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
        </Fragment>
      )}
    </CriterionsContainer>
  );
};

export default GenerateBatchRule;
