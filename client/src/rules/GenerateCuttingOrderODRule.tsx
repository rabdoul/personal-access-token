import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import useActivityConfiguration from '../activities/useActivityConfiguration';

import Select from '@lectra/select';
import { useUIState, useUIDispatch, ActivityId } from '../UIState';
import { useHelpUrls } from '../base/Help';
import StepDescription from './common/StepDescription';
import useRule from './common/useRule';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form, FormLine } from './common/styles';
import useRuleValidator from './common/useRuleValidator';
import { GenerateCuttingOrder } from './GenerateCuttingOrderRule';
import ItemsSwitcher from '@lectra/itemsswitcher';
import Input from '@lectra/input';
import ErrorIcon from './common/ErrorIcon';

const GenerateCuttingOrderODRule: React.FC = () => {
  const generateCTO = useRule('generate-cutting-order');
  const activityConfiguration = useActivityConfiguration('generate-cutting-order');
  const { editMode } = useUIState();

  const validateGenerateCuttingOrder = (generateCuttingOrder: Partial<GenerateCuttingOrder>) => {
    return generateCuttingOrder.productGrouping === 4 || isStrictlyPositive(generateCuttingOrder.maxNumberOfProducts);
  };
  useRuleValidator(activityConfiguration?.id as ActivityId | undefined, generateCTO, useCallback(validateGenerateCuttingOrder, []));

  if (generateCTO !== undefined && activityConfiguration !== undefined) {
    return (
      <Rule disabled={!editMode} activityConfiguration={activityConfiguration} rule={generateCTO}>
        {props => <GenerateCuttingOrderODForm {...props} />}
      </Rule>
    );
  } else {
    return <StepDescription />;
  }
};

const GenerateCuttingOrderODForm: React.FC<StatementResultFormProps<GenerateCuttingOrder>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const cuttingOrderModeHelpUrl = useHelpUrls(
    'PP_GENERATE_CUTTING_ORDERS_MODE',
    'PP_GENERATE_CUTTING_ORDERS_COMBINE',
    'PP_GENERATE_CUTTING_ORDERS_NUMBER_MAX',
    'PP_GENERATE_CUTTING_ORDERS_DISTRIBUTION'
  );
  const productGroupingListItems = [
    { value: '0', label: formatMessage({ id: 'rule.generate.cutting.order.one.per.product' }) },
    { value: '2', label: formatMessage({ id: 'rule.generate.cutting.order.combine' }) },
    { value: '4', label: formatMessage({ id: 'rule.generate.cutting.order.not.generate' }) }
  ];

  return (
    <Form>
      <FormLine helpUrl={cuttingOrderModeHelpUrl[0]}>
        <label>{formatMessage({ id: 'rule.generate.cutting.order.generation.mode' })}</label>
        <Select
          data-xlabel="cuttingOrderProductGroupingOD"
          listItems={productGroupingListItems}
          value={`${statementResult.productGrouping ?? 4}`}
          onChange={({ value }) =>
            dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-cutting-order', statementIndex, attribute: 'productGrouping', value: parseInt(value) })
          }
          width={350}
          disabled={disabled}
        />
      </FormLine>
      {statementResult.productGrouping !== 4 && statementResult.productGrouping !== undefined ? (
        <>
          <FormLine style={{ marginTop: '10px' }} helpUrl={cuttingOrderModeHelpUrl[1]}>
            <label>{formatMessage({ id: 'rule.generate.cutting.order.combine' })}</label>
            <ItemsSwitcher
              data-xlabel="canCombineCuttingOrdersOD"
              name="canCombineCuttingOrders"
              items={[
                { title: formatMessage({ id: 'common.yes' }), value: 'true' },
                { title: formatMessage({ id: 'common.no' }), value: 'false' }
              ]}
              defaultValue={statementResult.canMixCommands?.toString() ?? 'false'}
              onChange={({ value }) => {
                dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-cutting-order', statementIndex, attribute: 'canMixCommands', value: value });
              }}
              disabled={disabled}
            />
          </FormLine>
          <FormLine style={{ marginTop: '10px' }} helpUrl={cuttingOrderModeHelpUrl[2]}>
            <label>{formatMessage({ id: 'rule.generate.cutting.order.max.number' })}</label>
            <Input
              data-xlabel="generateCuttingOrderMaxNumberOD"
              onBlur={({ target: { value } }) => {
                dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-cutting-order', statementIndex, attribute: 'maxNumberOfProducts', value: parseInt(value) });
              }}
              type="number"
              value={statementResult.maxNumberOfProducts}
              disabled={disabled}
              min={1}
              icon={<ErrorIcon errorKey="error.not.positive.field" />}
              error={!isStrictlyPositive(statementResult.maxNumberOfProducts)}
            />
          </FormLine>
          <FormLine style={{ marginTop: '10px' }} helpUrl={cuttingOrderModeHelpUrl[3]}>
            <label>{formatMessage({ id: 'rule.generate.cutting.order.distribution' })}</label>
            <ItemsSwitcher
              data-xlabel="productDistributionOD"
              name="productDistribution"
              items={[
                { title: formatMessage({ id: 'common.balance' }), value: '0' },
                { title: formatMessage({ id: 'common.fill' }), value: '1' }
              ]}
              defaultValue={statementResult.groupDistribution?.toString() ?? '1'}
              onChange={({ value }) => {
                dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-cutting-order', statementIndex, attribute: 'groupDistribution', value: parseInt(value) });
              }}
              disabled={disabled}
            />
          </FormLine>
        </>
      ) : null}
    </Form>
  );
};

export default GenerateCuttingOrderODRule;

function isStrictlyPositive(number: number | undefined): boolean {
  return number !== undefined && number > 0;
}
