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
import { Form, FormLine } from './common/styles';

export interface GenerateBatch extends StatementResult {}

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

  // const updateGenrateBatch = (attribute: keyof GenerateBatch, value: any) => {
  //   dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-batch', statementIndex, attribute, value });
  // };

  return (
    <Form>
      <FormLine>
        <CheckBox disabled={disabled} checked={true} onChange={() => {}} xlabel="enableMaxPO" tickSize={13} />
        {formatMessage({ id: 'generate.batch.enable.max.po.batch' })}
        <Input onBlur={evt => {}} type="number" disabled={disabled} width={50} numberMaxDigits={0} min={0} data-xlabel="maxPOPerBatch" />
      </FormLine>
      <FormLine>
        {formatMessage({ id: 'generate.batch.group.orders.criteria' })}
        <Select data-xlabel="groupOrderCriteria" listItems={[]} onChange={item => {}} width={50} disabled={disabled} />
      </FormLine>
      <div>
        <FormLine>
          {formatMessage({ id: 'generate.batch.criteria' })}
          <Select data-xlabel="criteria" listItems={[]} onChange={item => {}} disabled={disabled} />
          <BasicButton disabled={disabled} toggled={false} type="white" onClick={() => {}}>
            <Icon type="add" />
          </BasicButton>
          <BasicButton disabled={disabled} toggled={false} type="white" onClick={() => {}}>
            <Icon type="delete" />
          </BasicButton>
        </FormLine>
        <FormLine>
          {formatMessage({ id: 'generate.batch.component.category' })}
          <Input onBlur={evt => {}} type="text" disabled={disabled} width={250} data-xlabel="componentCategory" />
          <CheckBox disabled={disabled} checked={true} onChange={() => {}} xlabel="withContrast" tickSize={13} />
          {formatMessage({ id: 'generate.batch.contrast' })}
        </FormLine>
        <FormLine>
          {formatMessage({ id: 'generate.batch.material.usage' })}
          <Input onBlur={evt => {}} type="text" disabled={disabled} width={250} data-xlabel="materialUsage" />
        </FormLine>
      </div>
    </Form>
  );
};

export default GenerateBatchRule;
