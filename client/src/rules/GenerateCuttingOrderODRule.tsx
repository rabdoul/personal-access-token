import React, { Fragment } from 'react';
import Input from '@lectra/input';
import ItemsSwitcher from '@lectra/itemsswitcher';
import Select from '@lectra/select';
import { useIntl } from 'react-intl';

import { LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import { useUIDispatch } from '../UIState';
import ErrorIcon from './common/ErrorIcon';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';
import { GenerateCuttingOrder } from './GenerateCuttingOrderRule';

const COMBINE_PRODUCT_ORDER_VALUE = 2;

const validateGenerateCuttingOrder = (generateCuttingOrder: Partial<GenerateCuttingOrder>) => {
  return generateCuttingOrder.productGrouping !== COMBINE_PRODUCT_ORDER_VALUE || isStrictlyPositive(generateCuttingOrder.maxNumberOfProducts);
};

const GenerateCuttingOrderODRule = () => (
  <Rule activityId={'generate-cutting-order'} validateStatementResult={validateGenerateCuttingOrder}>
    {props => <GenerateCuttingOrderODForm {...props} />}
  </Rule>
);

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
    { value: COMBINE_PRODUCT_ORDER_VALUE.toString(), label: formatMessage({ id: 'rule.generate.cutting.order.combine' }) },
    { value: '4', label: formatMessage({ id: 'rule.generate.cutting.order.not.generate' }) }
  ];

  return (
    <Form>
      <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[0]}>{formatMessage({ id: 'rule.generate.cutting.order.generation.mode' })}</LabelWithHelpTooltip>
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
      {statementResult.productGrouping === COMBINE_PRODUCT_ORDER_VALUE && statementResult.productGrouping !== undefined ? (
        <Fragment>
          <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[1]}>{formatMessage({ id: 'rule.generate.cutting.order.combine' })}</LabelWithHelpTooltip>
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
          <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[2]}>{formatMessage({ id: 'rule.generate.cutting.order.max.number' })}</LabelWithHelpTooltip>
          <Input
            data-xlabel="generateCuttingOrderMaxNumberOD"
            onChange={({ target: { value } }) => {
              dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-cutting-order', statementIndex, attribute: 'maxNumberOfProducts', value: parseInt(value) });
            }}
            type="number"
            value={statementResult.maxNumberOfProducts}
            disabled={disabled}
            min={1}
            icon={<ErrorIcon errorKey="error.not.positive.field" />}
            error={!isStrictlyPositive(statementResult.maxNumberOfProducts)}
          />
          <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[3]}>{formatMessage({ id: 'rule.generate.cutting.order.distribution' })}</LabelWithHelpTooltip>
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
        </Fragment>
      ) : null}
    </Form>
  );
};

export default GenerateCuttingOrderODRule;

function isStrictlyPositive(number: number | undefined): boolean {
  return number !== undefined && number > 0;
}
