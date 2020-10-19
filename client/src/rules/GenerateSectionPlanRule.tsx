import React from 'react';
import { useIntl } from 'react-intl';
import ItemsSwitcher from '@lectra/itemsswitcher';
import useRule from './common/useRule';
import { useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { StatementResult } from '../model';
import { Form, FormLine, StyledSelect } from './common/styles';
import Input from '@lectra/input';

export interface GenerateSectionPlan extends StatementResult {
  sectionPlanGeneration: number;
  canLimitMarkerByProductNumber: boolean;
  maxNumberOfProducts: number;
  groupDistribution: number;
}

const GenerateSectionPlanRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('generate-section-plan');
  const activityConfiguration = useActivityConfiguration('generate-section-plan');

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <GenerateSectionPlanResultForm {...props} />}
    </Rule>
  );
};

const GenerateSectionPlanResultForm: React.FC<StatementResultFormProps<GenerateSectionPlan>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine>
        <label htmlFor="">{formatMessage({ id: 'generation.mode' })}</label>
        <StyledSelect
          listItems={[
            { label: 'Automatic', value: '0' },
            { label: 'Manual', value: '1' }
          ]}
          value={`${statementResult.groupDistribution}`}
          onChange={item => {}}
          width={200}
          disabled={disabled}
        />
      </FormLine>
      <FormLine>
        <label htmlFor="">{formatMessage({ id: 'limit.products' })}</label>
        <ItemsSwitcher
          name=""
          onChange={() => {}}
          items={[
            { title: 'Yes', value: 'true' },
            { title: 'No', value: 'false' }
          ]}
          defaultValue={`${statementResult.canLimitMarkerByProductNumber}`}
        />
      </FormLine>
      <FormLine>
        <label htmlFor="">{formatMessage({ id: 'max.product.number' })}</label>
        <Input onBlur={() => {}} type="number" value={statementResult.maxNumberOfProducts} />
      </FormLine>
      <FormLine>
        <label htmlFor="">{formatMessage({ id: 'product.distribution' })}</label>
        <ItemsSwitcher
          name=""
          onChange={() => {}}
          items={[
            { title: 'Balance', value: '0' },
            { title: 'Fill', value: '1' }
          ]}
          defaultValue={`${statementResult.groupDistribution}`}
        />
      </FormLine>
    </Form>
  );
};

export default GenerateSectionPlanRule;
