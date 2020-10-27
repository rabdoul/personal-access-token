import React, { Fragment } from 'react';
import Input from '@lectra/input';
import ItemsSwitcher from '@lectra/itemsswitcher';
import { useIntl } from 'react-intl';

import { StatementResult } from '../model';
import { useUIDispatch } from '../UIState';
import { MANDATORY_FIELD_ERROR } from './common/ErrorIcon';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form, StyledSelect } from './common/styles';

export interface GenerateSectionPlan extends StatementResult {
  sectionPlanGeneration: number;
  canLimitMarkerByProductNumber: boolean;
  maxNumberOfProducts: number;
  groupDistribution: number;
}

function isMaxNumberOfProductsValid(result: Partial<GenerateSectionPlan>) {
  return result.sectionPlanGeneration === 0 && result.canLimitMarkerByProductNumber ? result.maxNumberOfProducts !== undefined : true;
}

function isPlanGenerationValid(result: Partial<GenerateSectionPlan>) {
  return result.sectionPlanGeneration !== undefined;
}

const validateStatementResult = (result: Partial<GenerateSectionPlan>) => {
  return isPlanGenerationValid(result) && isMaxNumberOfProductsValid(result);
};

const GenerateSectionPlanRule = () => (
  <Rule activityId={'generate-section-plan'} validateStatementResult={validateStatementResult}>
    {props => <GenerateSectionPlanResultForm {...props} />}
  </Rule>
);

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
    { title: formatMessage({ id: 'common.balance' }), value: '0' },
    { title: formatMessage({ id: 'common.fill' }), value: '1' }
  ];

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <label>{formatMessage({ id: 'rule.generate.section.plan.generation.mode' })}</label>
      <StyledSelect
        data-xlabel="generation-mode"
        listItems={sectionPlanGenerationItems}
        value={statementResult.sectionPlanGeneration?.toString()}
        onChange={({ value }) =>
          dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-section-plan', statementIndex, attribute: 'sectionPlanGeneration', value: parseInt(value) })
        }
        width={200}
        disabled={disabled}
        error={!isPlanGenerationValid(statementResult)}
        icon={MANDATORY_FIELD_ERROR}
      />
      {isAutomaticGeneration && (
        <Fragment>
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
          {isProductNumberLimited && (
            <Fragment>
              <label htmlFor="maxNumberOfProducts">{formatMessage({ id: 'rule.generate.section.plan.max.product.number' })}</label>
              <Input
                data-xlabel="maxNumberOfProducts"
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
            </Fragment>
          )}
        </Fragment>
      )}
    </Form>
  );
};

export default GenerateSectionPlanRule;
