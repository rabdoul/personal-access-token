import React from 'react';
import { useIntl } from 'react-intl';
import ItemsSwitcher from '@lectra/itemsswitcher';
import useRule from './common/useRule';
import { useUIDispatch, useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { StatementResult } from '../model';
import { Form, FormLine, StyledSelect } from './common/styles';
import useRuleValidator from './common/useRuleValidator';

export interface GenerateSpreadingPlan extends StatementResult {
  spreadingPlanGeneration: number;
  spreadingPlanDistribution: number;
}

const GenerateSpreadingPlanRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('generate-spreading-plan');
  const activityConfiguration = useActivityConfiguration('generate-spreading-plan');
  useRuleValidator('generate-spreading-plan', rule);

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <GenerateSpreadingPlanResultForm {...props} />}
    </Rule>
  );
};

const GenerateSpreadingPlanResultForm: React.FC<StatementResultFormProps<GenerateSpreadingPlan>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const sectionPlanGenerationItems = [
    { label: formatMessage({ id: 'rule.generate.section.plan.generation.automatic' }), value: '0' },
    { label: formatMessage({ id: 'rule.generate.section.plan.generation.manual' }), value: '1' }
  ];

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine>
        <label htmlFor="spreadingPlanGeneration">{formatMessage({ id: 'rule.generate.section.plan.generation.mode' })}</label>
        <StyledSelect
          name="spreadingPlanGeneration"
          listItems={sectionPlanGenerationItems}
          value={`${statementResult.spreadingPlanGeneration}`}
          onChange={({ value }) =>
            dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-spreading-plan', statementIndex, attribute: 'spreadingPlanGeneration', value: parseInt(value) })
          }
          width={200}
          disabled={disabled}
        />
      </FormLine>
      {statementResult.spreadingPlanGeneration === 0 && (
        <>
          <FormLine>
            <label htmlFor="spreadingPlanDistribution">{formatMessage({ id: 'rule.generate.section.plan.limit.products' })}</label>
          </FormLine>
        </>
      )}
    </Form>
  );
};

export default GenerateSpreadingPlanRule;
