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
  const dispatch = useUIDispatch();

  const isAutomaticGeneration = statementResult.sectionPlanGeneration === 0;
  const isProductNumberLimited = statementResult.canLimitMarkerByProductNumber;

  const sectionPlanGenerationItems = [
    { label: 'Automatic', value: '0' },
    { label: 'Manual', value: '1' }
  ];
  const groupDistributionItems = [
    { title: 'Balance', value: '0' },
    { title: 'Fill', value: '1' }
  ];

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine>
        <label htmlFor="sectionPlanGeneration">{formatMessage({ id: 'rule.generate.section.plan.generation.mode' })}</label>
        <StyledSelect
          name="sectionPlanGeneration"
          listItems={sectionPlanGenerationItems}
          value={`${statementResult.sectionPlanGeneration}`}
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
                { title: 'Yes', value: 'true' },
                { title: 'No', value: 'false' }
              ]}
              defaultValue={`${statementResult.canLimitMarkerByProductNumber}`}
              onChange={({ value }) =>
                dispatch({
                  type: 'UPDATE_STATEMENT_RESULT',
                  activityId: 'generate-section-plan',
                  statementIndex,
                  attribute: 'canLimitMarkerByProductNumber',
                  value: value === 'true'
                })
              }
              additionalAttributes={{ disabled: true }}
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
                  value={statementResult.maxNumberOfProducts}
                  disabled={disabled}
                />
              </FormLine>
              <FormLine>
                <label htmlFor="groupDistribution">{formatMessage({ id: 'rule.generate.section.plan.product.distribution' })}</label>
                <ItemsSwitcher
                  name="groupDistribution"
                  items={groupDistributionItems}
                  defaultValue={`${statementResult.groupDistribution}`}
                  onChange={({ value }) =>
                    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-section-plan', statementIndex, attribute: 'groupDistribution', value: parseInt(value) })
                  }
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
