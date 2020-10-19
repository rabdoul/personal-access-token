import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import CheckBox from '@lectra/checkbox';
import Input from '@lectra/input';
import Select from '@lectra/select';
import Icon from '@lectra/icon';
import BasicButton from '@lectra/basicbutton';

import { StatementResult } from '../model';
import { useUIState } from '../UIState';
import useRule from './common/useRule';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form, FormLine } from './common/styles';

export interface GenerateBatch extends StatementResult {}

const GenerateBatchRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('generate-batch');
  const activityConfiguration = useActivityConfiguration('generate-batch');
  // const activityId = activityConfiguration?.id as ActivityId | undefined;

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
  // const dispatch = useUIDispatch();

  // const updateGenrateBatch = (attribute: keyof GenerateBatch, value: any) => {
  //   dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-batch', statementIndex, attribute, value });
  // };

  return (
    <Form>
      <FormLine style={{ marginBottom: '10px' }}>
        <FormLabel>
          <CheckBox
            disabled={disabled}
            checked={true}
            onChange={() => {}}
            xlabel="enableMaxPO"
            tickSize={13}
            label={formatMessage({ id: 'rule.generate.batch.enable.max.po.batch' })}
          />
        </FormLabel>
        <Input onBlur={evt => {}} type="number" disabled={disabled} width={50} numberMaxDigits={0} min={0} data-xlabel="maxPOPerBatch" />
      </FormLine>
      <FormLine>
        <FormLabel>{formatMessage({ id: 'rule.generate.batch.group.orders.criteria' })}</FormLabel>
        <Select data-xlabel="groupOrderCriteria" listItems={[]} onChange={item => {}} width={50} disabled={disabled} />
      </FormLine>
      <CriteriasBlock disabled={disabled} criteriaIndex={0} />
    </Form>
  );
};

const CriteriasBlock: React.FC<{ disabled: boolean; criteriaIndex: number }> = ({ disabled, criteriaIndex }) => {
  const { formatMessage } = useIntl();

  return (
    <CriteriasContainer data-xrow={criteriaIndex} data-xlabel="criterias">
      <FormLine style={{ marginBottom: '10px' }}>
        <CriteriaLabel>{formatMessage({ id: criteriaIndex === 0 ? 'rule.generate.batch.criteria' : 'rule.generate.batch.then.criteria' })}</CriteriaLabel>
        <Select data-xlabel="criteria" listItems={[]} onChange={item => {}} disabled={disabled} />
        <ButtonGroup>
          <BasicButton disabled={disabled} toggled={false} type="white" onClick={() => {}}>
            <Icon type="add" />
          </BasicButton>
          <BasicButton disabled={disabled} toggled={false} type="white" onClick={() => {}}>
            <Icon type="delete" />
          </BasicButton>
        </ButtonGroup>
      </FormLine>
      <FormLine style={{ marginBottom: '10px' }}>
        <CriteriaLabel>{formatMessage({ id: 'rule.generate.batch.component.category' })}</CriteriaLabel>
        <Input onBlur={evt => {}} type="text" disabled={disabled} width={200} data-xlabel="componentCategory" />
        <div style={{ marginLeft: '20px' }}>
          <CheckBox disabled={disabled} checked={true} onChange={() => {}} xlabel="withContrast" tickSize={13} label={formatMessage({ id: 'rule.generate.batch.contrast' })} />
        </div>
      </FormLine>
      <FormLine>
        <CriteriaLabel>{formatMessage({ id: 'rule.generate.batch.material.usage' })}</CriteriaLabel>
        <Input onBlur={evt => {}} type="text" disabled={disabled} width={200} data-xlabel="materialUsage" />
      </FormLine>
    </CriteriasContainer>
  );
};

export default GenerateBatchRule;

const CriteriasContainer = styled.div`
  border: 1px solid #333;
  margin-top: 15px;
  padding: 10px 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-left: 40px;
  gap: 10px;
`;

const FormLabel = styled.div`
  align-items: center;
  display: flex;
  margin-right: 10px;
  width: 340px;
`;

const CriteriaLabel = styled.div`
  margin-right: 10px;
  width: 170px;
`;
