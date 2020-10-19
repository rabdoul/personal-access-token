import React from 'react';
import { useIntl } from 'react-intl';
import CheckBox from '@lectra/checkbox';
import Input from '@lectra/input';
import Select from '@lectra/select';
import Icon from '@lectra/icon';
import BasicButton from '@lectra/basicbutton';

import { StatementResult } from '../model';
import { ActivityId, useUIDispatch, useUIState } from '../UIState';
import useRule from './common/useRule';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { ButtonGroup, CriteriaLabel, CriteriasContainer, Form, FormLabel, FormLine, StyledSmallSelect } from './common/styles';

interface Criterion {
  batchGenerationCriterionType: number;
  componentCategory?: string;
  componentMaterialUsage?: string;
  isContrast?: boolean;
}

export interface GenerateBatch extends StatementResult {
  batchGenerationType: number;
  useMaxNumberOfOrder: boolean;
  maxNumberOfOrders: number;
  criterions?: Criterion[];
}

const GenerateBatchRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('generate-batch');
  const activityConfiguration = useActivityConfiguration('generate-batch');
  const activityId = activityConfiguration?.id as ActivityId | undefined;

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

  const updateGenerateBatch = (attribute: keyof GenerateBatch, value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-batch', statementIndex, attribute, value });
  };

  const groupOrdersPerCriteriaItems = [
    { label: formatMessage({ id: 'common.no' }), value: '0' },
    { label: formatMessage({ id: 'common.yes' }), value: '1' }
  ];

  return (
    <Form>
      <FormLine style={{ marginBottom: '10px' }}>
        <FormLabel>
          <CheckBox
            disabled={disabled}
            checked={statementResult.useMaxNumberOfOrder ?? true}
            onChange={(value: any) => {
              if (statementResult.batchGenerationType === 0) updateGenerateBatch('useMaxNumberOfOrder', value);
            }}
            xlabel="enableMaxPO"
            tickSize={13}
            label={formatMessage({ id: 'rule.generate.batch.enable.max.po.batch' })}
          />
        </FormLabel>
        <Input
          onBlur={evt => updateGenerateBatch('maxNumberOfOrders', parseInt(evt.target.value))}
          value={statementResult.maxNumberOfOrders}
          type="number"
          disabled={disabled}
          width={50}
          numberMaxDigits={0}
          min={0}
          data-xlabel="maxPOPerBatch"
        />
      </FormLine>
      <FormLine>
        <FormLabel>{formatMessage({ id: 'rule.generate.batch.group.orders.criteria' })}</FormLabel>
        <StyledSmallSelect
          data-xlabel="groupOrderCriteria"
          listItems={groupOrdersPerCriteriaItems}
          onChange={({ value }) => updateGenerateBatch('batchGenerationType', parseInt(value))}
          width={50}
          disabled={disabled}
          value={`${statementResult.batchGenerationType}`}
        />
      </FormLine>
      {statementResult.criterions &&
        statementResult.criterions.map((criterion: Criterion, index: number) => {
          return (
            <CriteriasBlock key={`criterion-${index}`} disabled={disabled} criteriaIndex={index} criterion={criterion} criterionsLength={statementResult.criterions!.length} />
          );
        })}
    </Form>
  );
};

const CriteriasBlock: React.FC<{ disabled: boolean; criteriaIndex: number; criterion: Criterion; criterionsLength: number }> = ({
  disabled,
  criteriaIndex,
  criterion,
  criterionsLength
}) => {
  const { formatMessage } = useIntl();
  const criteriaItems = [
    { label: formatMessage({ id: 'common.criteria.material' }), value: '0' },
    { label: formatMessage({ id: 'common.criteria.delivery.date' }), value: '1' },
    { label: formatMessage({ id: 'common.criteria.order.date' }), value: '2' }
  ];

  return (
    <CriteriasContainer data-xrow={criteriaIndex} data-xlabel="criterias">
      <FormLine style={{ marginBottom: '10px' }}>
        <CriteriaLabel>{formatMessage({ id: criteriaIndex === 0 ? 'rule.generate.batch.criteria' : 'rule.generate.batch.then.criteria' })}</CriteriaLabel>
        <Select data-xlabel="criteria" listItems={criteriaItems} onChange={item => {}} disabled={disabled} value={`${criterion.batchGenerationCriterionType}`} width={120} />
        <ButtonGroup>
          <BasicButton disabled={disabled} toggled={false} type="white" onClick={() => {}}>
            <Icon type="add" />
          </BasicButton>
          <BasicButton disabled={disabled || criterionsLength === 1} toggled={false} type="white" onClick={() => {}}>
            <Icon type="delete" />
          </BasicButton>
        </ButtonGroup>
      </FormLine>
      {criterion.batchGenerationCriterionType === 0 && (
        <>
          <FormLine style={{ marginBottom: '10px' }}>
            <CriteriaLabel>{formatMessage({ id: 'rule.generate.batch.component.category' })}</CriteriaLabel>
            <Input onBlur={evt => {}} value={criterion.componentCategory} type="text" disabled={disabled} width={200} data-xlabel="componentCategory" />
            <div style={{ marginLeft: '20px' }}>
              <CheckBox
                disabled={disabled}
                checked={criterion.isContrast ?? true}
                onChange={() => {}}
                xlabel="withContrast"
                tickSize={13}
                label={formatMessage({ id: 'rule.generate.batch.contrast' })}
              />
            </div>
          </FormLine>
          <FormLine>
            <CriteriaLabel>{formatMessage({ id: 'rule.generate.batch.material.usage' })}</CriteriaLabel>
            <Input onBlur={evt => {}} value={criterion.componentMaterialUsage} type="text" disabled={disabled} width={200} data-xlabel="materialUsage" />
          </FormLine>
        </>
      )}
    </CriteriasContainer>
  );
};

export default GenerateBatchRule;
