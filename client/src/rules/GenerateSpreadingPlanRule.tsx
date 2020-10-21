import React from 'react';
import { useIntl } from 'react-intl';
import useRule from './common/useRule';
import { useUIDispatch, useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { StatementResult } from '../model';
import { Form, FormLine, StyledSelect } from './common/styles';
import useRuleValidator from './common/useRuleValidator';
import { MANDATORY_FIELD_ERROR } from './common/ErrorIcon';

export interface GenerateSpreadingPlan extends StatementResult {
  spreadingPlanGeneration: number;
  spreadingPlanDistribution: number;
}

function isPlanGenerationValid(result: Partial<GenerateSpreadingPlan>) {
  return result.spreadingPlanGeneration !== undefined;
}

function isDistributionValid(result: Partial<GenerateSpreadingPlan>) {
  return result.spreadingPlanGeneration === 1 || result.spreadingPlanDistribution !== undefined;
}

const validateStatementResult = (result: Partial<GenerateSpreadingPlan>) => {
  return isPlanGenerationValid(result) && isDistributionValid(result);
};

const GenerateSpreadingPlanRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('generate-spreading-plan');
  const activityConfiguration = useActivityConfiguration('generate-spreading-plan');
  useRuleValidator('generate-spreading-plan', rule, validateStatementResult);

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

  const generationModeItems = [
    { label: formatMessage({ id: 'rule.generate.section.plan.generation.automatic' }), value: '0' },
    { label: formatMessage({ id: 'rule.generate.section.plan.generation.manual' }), value: '1' }
  ];

  const distributionModeItems = [
    { label: formatMessage({ id: 'rule.generate.spreading.plan.no.split' }), value: '0' },
    { label: formatMessage({ id: 'rule.generate.spreading.plan.split.equivalent' }), value: '1' },
    { label: formatMessage({ id: 'rule.generate.spreading.plan.split.maximize' }), value: '2' }
  ];
  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine>
        <label>{formatMessage({ id: 'rule.generate.spreading.plan.generation.mode' })}</label>
        <StyledSelect
          data-xlabel="generation-mode"
          listItems={generationModeItems}
          value={statementResult.spreadingPlanGeneration?.toString()}
          onChange={({ value }) =>
            dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-spreading-plan', statementIndex, attribute: 'spreadingPlanGeneration', value: parseInt(value) })
          }
          width={200}
          disabled={disabled}
          error={!isPlanGenerationValid(statementResult)}
          icon={MANDATORY_FIELD_ERROR}
        />
      </FormLine>
      {statementResult.spreadingPlanGeneration === 0 && (
        <FormLine>
          <label>{formatMessage({ id: 'rule.generate.spreading.plan.distribution.mode' })}</label>
          <StyledSelect
            data-xlabel="distribution-mode"
            listItems={distributionModeItems}
            value={statementResult.spreadingPlanDistribution?.toString()}
            onChange={({ value }) =>
              dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-spreading-plan', statementIndex, attribute: 'spreadingPlanDistribution', value: parseInt(value) })
            }
            width={200}
            disabled={disabled}
            error={!isDistributionValid(statementResult)}
            icon={MANDATORY_FIELD_ERROR}
          />
        </FormLine>
      )}
    </Form>
  );
};

export default GenerateSpreadingPlanRule;
