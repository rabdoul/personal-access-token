import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import { LabelWithHelpTooltip } from '../base/Help';
import { StatementResult } from '../model';
import { useUIDispatch } from '../UIState';
import { MANDATORY_FIELD_ERROR } from './common/ErrorIcon';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form, StyledSelect } from './common/styles';

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

const GenerateSpreadingPlanRule = () => (
  <Rule activityId={'generate-spreading-plan'} validateStatementResult={validateStatementResult}>
    {props => <GenerateSpreadingPlanResultForm {...props} />}
  </Rule>
);

const GenerateSpreadingPlanResultForm: React.FC<StatementResultFormProps<GenerateSpreadingPlan>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const generationModeItems = [
    { label: formatMessage({ id: 'rule.generate.section.plan.generation.automatic' }), value: '0' },
    { label: formatMessage({ id: 'rule.generate.section.plan.generation.manual' }), value: '1' }
  ];

  const distributionModeItems = [
    { label: formatMessage({ id: 'rule.generate.spreading.plan.no.split' }), value: '0' },
    { label: formatMessage({ id: 'rule.generate.spreading.plan.split.maximize' }), value: '1' },
    { label: formatMessage({ id: 'rule.generate.spreading.plan.no.split.equivalent' }), value: '2' }
  ];
  return (
    <Form>
      <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.spreading.plan.generation.mode' })}</LabelWithHelpTooltip>
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
      {statementResult.spreadingPlanGeneration === 0 && (
        <Fragment>
          <LabelWithHelpTooltip>{formatMessage({ id: 'rule.generate.spreading.plan.distribution.mode' })}</LabelWithHelpTooltip>
          <StyledSelect
            data-xlabel="distribution-mode"
            listItems={distributionModeItems}
            value={statementResult.spreadingPlanDistribution?.toString()}
            onChange={({ value }) =>
              dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-spreading-plan', statementIndex, attribute: 'spreadingPlanDistribution', value: parseInt(value) })
            }
            width={340}
            disabled={disabled}
            error={!isDistributionValid(statementResult)}
            icon={MANDATORY_FIELD_ERROR}
          />
        </Fragment>
      )}
    </Form>
  );
};

export default GenerateSpreadingPlanRule;
