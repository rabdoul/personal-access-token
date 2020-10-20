import React from 'react';
import { useIntl } from 'react-intl';
import ItemsSwitcher from '@lectra/itemsswitcher';
import useRule from './common/useRule';
import { useUIDispatch, useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { StatementResult } from '../model';
import { Form, FormLine, StyledSelect } from './common/styles';
import Input from '@lectra/input';
import useRuleValidator from './common/useRuleValidator';
import { MANDATORY_FIELD_ERROR } from './common/ErrorIcon';

export interface GenerateSectionPlan extends StatementResult {
  sectionPlanGeneration: number;
  canLimitMarkerByProductNumber: boolean;
  maxNumberOfProducts: number;
  groupDistribution: number;
}

function isMaxNumberOfProductsValid(result: Partial<GenerateSectionPlan>) {
  return result.sectionPlanGeneration === 0 && result.canLimitMarkerByProductNumber ? result.maxNumberOfProducts !== undefined : true;
}

const validateStatementResult = (result: Partial<GenerateSectionPlan>) => {
  return isMaxNumberOfProductsValid(result);
};

const GenerateSectionPlanRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('generate-section-plan');
  const activityConfiguration = useActivityConfiguration('generate-section-plan');
  useRuleValidator('generate-section-plan', rule, validateStatementResult);

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
  const dispatch = useUIDispatch();

  const isAutomaticGeneration = statementResult.sectionPlanGeneration === 0;
  const isProductNumberLimited = statementResult.canLimitMarkerByProductNumber;

  const sectionPlanGenerationItems = [
    { label: formatMessage({ id: 'rule.generate.section.plan.generation.automatic' }), value: '0' },
    { label: formatMessage({ id: 'rule.generate.section.plan.generation.manual' }), value: '1' }
  ];
  const groupDistributionItems = [
    { title: formatMessage({ id: 'rule.generate.section.plan.distribution.balance' }), value: '0' },
    { title: formatMessage({ id: 'rule.generate.section.plan.distribution.fill' }), value: '1' }
  ];

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine>
        <label>{formatMessage({ id: 'rule.generate.section.plan.generation.mode' })}</label>
        <StyledSelect
          listItems={sectionPlanGenerationItems}
          value={statementResult.sectionPlanGeneration?.toString()}
          onChange={({ value }) =>
            dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-section-plan', statementIndex, attribute: 'sectionPlanGeneration', value: parseInt(value) })
          }
          width={200}
          disabled={disabled}
        />
      </FormLine>
      {isAutomaticGeneration && (
        <>
          <FormLine>
            <label htmlFor="canLimitMarkerByProductNumber">{formatMessage({ id: 'rule.generate.section.plan.limit.products' })}</label>
            <ItemsSwitcher
              name="canLimitMarkerByProductNumber"
              items={[
                { title: formatMessage({ id: 'common.yes' }), value: 'true' },
                { title: formatMessage({ id: 'common.no' }), value: 'false' }
              ]}
              defaultValue={statementResult.canLimitMarkerByProductNumber?.toString() ?? 'false'}
              onChange={({ value }) =>
                dispatch({
                  type: 'UPDATE_STATEMENT_RESULT',
                  activityId: 'generate-section-plan',
                  statementIndex,
                  attribute: 'canLimitMarkerByProductNumber',
                  value: value === 'true'
                })
              }
              disabled={disabled}
            />
          </FormLine>
          {isProductNumberLimited && (
            <>
              <FormLine>
                <label htmlFor="maxNumberOfProducts">{formatMessage({ id: 'rule.generate.section.plan.max.product.number' })}</label>
                <Input
                  name="maxNumberOfProducts"
                  onBlur={({ target: { value } }) =>
                    dispatch({
                      type: 'UPDATE_STATEMENT_RESULT',
                      activityId: 'generate-section-plan',
                      statementIndex,
                      attribute: 'maxNumberOfProducts',
                      value: value ? parseInt(value) : undefined
                    })
                  }
                  type="number"
                  min={0}
                  value={statementResult.maxNumberOfProducts}
                  disabled={disabled}
                  error={!isMaxNumberOfProductsValid(statementResult)}
                  icon={MANDATORY_FIELD_ERROR}
                />
              </FormLine>
              <FormLine>
                <label htmlFor="groupDistribution">{formatMessage({ id: 'rule.generate.section.plan.product.distribution' })}</label>
                <ItemsSwitcher
                  name="groupDistribution"
                  items={groupDistributionItems}
                  defaultValue={statementResult.groupDistribution?.toString() ?? '0'}
                  onChange={({ value }) =>
                    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-section-plan', statementIndex, attribute: 'groupDistribution', value: parseInt(value) })
                  }
                  disabled={disabled}
                />
              </FormLine>
            </>
          )}
        </>
      )}
    </Form>
  );
};

export default GenerateSectionPlanRule;
