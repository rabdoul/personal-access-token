import React, { Fragment } from 'react';
import Input from '@lectra/input';
import ItemsSwitcher from '@lectra/itemsswitcher';
import Select from '@lectra/select';
import { useIntl } from 'react-intl';

import { CheckBoxWithHelpTooltip, LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import { useUIDispatch } from '../UIState';
import ErrorIcon from './common/ErrorIcon';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';
import { DistributionPerGroup, GenerateCuttingOrder } from './GenerateCuttingOrderRule';

const COMBINE_PRODUCT_ORDER_VALUE = 2;

type ValidationResult = {
  isValid: boolean;
  error?: string;
};

const validateGenerateCuttingOrder = (generateCuttingOrder: Partial<GenerateCuttingOrder>) => {
  if (generateCuttingOrder.productGrouping !== COMBINE_PRODUCT_ORDER_VALUE) return true;

  let validationResult = isProductDistributionPerCuttingOrderValid(generateCuttingOrder);
  if (!validationResult.isValid) return false;

  validationResult = isProductDistributionPerNestingGroupValid(generateCuttingOrder);
  return validationResult.isValid;
};

function isProductDistributionPerCuttingOrderValid(generateCuttingOrder: Partial<GenerateCuttingOrder>): ValidationResult {
  if (!generateCuttingOrder.productDistributionPerCuttingOrder?.enabled) return { isValid: true };

  if (!isStrictlyPositive(generateCuttingOrder.productDistributionPerCuttingOrder.maxNumberPerGroup))
    return {
      isValid: false,
      error: 'error.not.positive.field'
    };

  return { isValid: true };
}

function isProductDistributionPerNestingGroupValid(generateCuttingOrder: Partial<GenerateCuttingOrder>): ValidationResult {
  if (!generateCuttingOrder.productDistributionPerNestingGroup?.enabled) return { isValid: true };

  if (!isStrictlyPositive(generateCuttingOrder.productDistributionPerNestingGroup.maxNumberPerGroup))
    return {
      isValid: false,
      error: 'error.not.positive.field'
    };

  if (
    generateCuttingOrder.productDistributionPerCuttingOrder?.enabled &&
    generateCuttingOrder.productDistributionPerNestingGroup.maxNumberPerGroup >= generateCuttingOrder.productDistributionPerCuttingOrder.maxNumberPerGroup
  )
    return { isValid: false, error: 'error.distribution.per.nesting-group.more.than.per.cutting-order' };

  return { isValid: true };
}

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
    'PP_GENERATE_CUTTING_ORDERS_PRODUCT_DISTRIBUTION_PER_CUTTING_ORDER',
    'PP_GENERATE_CUTTING_ORDERS_PRODUCT_DISTRIBUTION_PER_CUTTING_ORDER_NUMBER_MAX',
    'PP_GENERATE_CUTTING_ORDERS_PRODUCT_DISTRIBUTION_PER_CUTTING_ORDER_MODE',
    'PP_GENERATE_CUTTING_ORDERS_PRODUCT_DISTRIBUTION_PER_NESTING_GROUP',
    'PP_GENERATE_CUTTING_ORDERS_PRODUCT_DISTRIBUTION_PER_NESTING_GROUP_NUMBER_MAX',
    'PP_GENERATE_CUTTING_ORDERS_PRODUCT_DISTRIBUTION_PER_NESTING_GROUP_MODE'
  );
  const productGroupingListItems = [
    { value: '0', label: formatMessage({ id: 'rule.generate.cutting.order.one.per.product' }) },
    {
      value: COMBINE_PRODUCT_ORDER_VALUE.toString(),
      label: formatMessage({ id: 'rule.generate.cutting.order.combine' })
    },
    { value: '4', label: formatMessage({ id: 'rule.generate.cutting.order.not.generate' }) }
  ];

  const productDistributionPerCuttingOrderValidationResult = isProductDistributionPerCuttingOrderValid(statementResult);
  const productDistributionPerNestingGroupValidationResult = isProductDistributionPerNestingGroupValid(statementResult);

  return (
    <Form>
      <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[0]}>{formatMessage({ id: 'rule.generate.cutting.order.generation.mode' })}</LabelWithHelpTooltip>
      <Select
        data-xlabel="cuttingOrderProductGroupingOD"
        listItems={productGroupingListItems}
        value={`${statementResult.productGrouping ?? 4}`}
        onChange={({ value }) =>
          dispatch({
            type: 'UPDATE_STATEMENT_RESULT',
            activityId: 'generate-cutting-order',
            statementIndex,
            attribute: 'productGrouping',
            value: parseInt(value)
          })
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
              dispatch({
                type: 'UPDATE_STATEMENT_RESULT',
                activityId: 'generate-cutting-order',
                statementIndex,
                attribute: 'canMixCommands',
                value: value
              });
            }}
            disabled={disabled}
          />
          <CheckBoxWithHelpTooltip
            disabled={disabled}
            label={formatMessage({ id: 'rule.generate.cutting.order.product.distribution.per.cutting-order' })}
            checked={statementResult.productDistributionPerCuttingOrder?.enabled ?? false}
            onChange={value => {
              const distrib: DistributionPerGroup = statementResult.productDistributionPerCuttingOrder
                ? {
                    ...statementResult.productDistributionPerCuttingOrder,
                    enabled: value
                  }
                : { enabled: value, maxNumberPerGroup: 0, groupDistribution: 0 };
              dispatch({
                type: 'UPDATE_STATEMENT_RESULT',
                activityId: 'generate-cutting-order',
                statementIndex: statementIndex,
                attribute: 'productDistributionPerCuttingOrder',
                value: distrib
              });
            }}
            xlabel="enableProductDistributionPerCuttingOrder"
            tickSize={13}
            helpUrl={cuttingOrderModeHelpUrl[2]}
          />
          <div />
          <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[3]}>
            {formatMessage({ id: 'rule.generate.cutting.order.product.distribution.per.cutting-order.max.number' })}
          </LabelWithHelpTooltip>
          <Input
            data-xlabel="productDistributionPerCuttingOrderMaxNumberOD"
            onChange={({ target: { value } }) => {
              const distrib: DistributionPerGroup = statementResult.productDistributionPerCuttingOrder
                ? {
                    ...statementResult.productDistributionPerCuttingOrder,
                    maxNumberPerGroup: parseInt(value)
                  }
                : { enabled: false, maxNumberPerGroup: parseInt(value), groupDistribution: 0 };
              dispatch({
                type: 'UPDATE_STATEMENT_RESULT',
                activityId: 'generate-cutting-order',
                statementIndex,
                attribute: 'productDistributionPerCuttingOrder',
                value: distrib
              });
            }}
            type="number"
            value={statementResult.productDistributionPerCuttingOrder?.maxNumberPerGroup}
            disabled={disabled || (!statementResult.productDistributionPerCuttingOrder?.enabled ?? true)}
            min={1}
            icon={<ErrorIcon errorKey={productDistributionPerCuttingOrderValidationResult.error} />}
            error={!productDistributionPerCuttingOrderValidationResult.isValid}
          />
          <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[4]}>
            {formatMessage({ id: 'rule.generate.cutting.order.product.distribution.per.cutting-order.distribution' })}
          </LabelWithHelpTooltip>
          <ItemsSwitcher
            data-xlabel="productDistributionPerCuttingOrderOD"
            name="productDistributionPerCuttingOrder"
            items={[
              { title: formatMessage({ id: 'common.balance' }), value: '0' },
              { title: formatMessage({ id: 'common.fill' }), value: '1' }
            ]}
            defaultValue={statementResult.productDistributionPerCuttingOrder?.groupDistribution?.toString() ?? '1'}
            onChange={({ value }) => {
              const distrib: DistributionPerGroup = statementResult.productDistributionPerCuttingOrder
                ? {
                    ...statementResult.productDistributionPerCuttingOrder,
                    groupDistribution: parseInt(value)
                  }
                : { enabled: false, maxNumberPerGroup: 0, groupDistribution: parseInt(value) };
              dispatch({
                type: 'UPDATE_STATEMENT_RESULT',
                activityId: 'generate-cutting-order',
                statementIndex,
                attribute: 'productDistributionPerCuttingOrder',
                value: distrib
              });
            }}
            disabled={disabled || (!statementResult.productDistributionPerCuttingOrder?.enabled ?? true)}
          />
          <CheckBoxWithHelpTooltip
            disabled={disabled}
            label={formatMessage({ id: 'rule.generate.cutting.order.product.distribution.per.nesting-group' })}
            checked={statementResult.productDistributionPerNestingGroup?.enabled ?? false}
            onChange={value => {
              const distrib: DistributionPerGroup = statementResult.productDistributionPerNestingGroup
                ? {
                    ...statementResult.productDistributionPerNestingGroup,
                    enabled: value
                  }
                : { enabled: value, maxNumberPerGroup: 0, groupDistribution: 0 };
              dispatch({
                type: 'UPDATE_STATEMENT_RESULT',
                activityId: 'generate-cutting-order',
                statementIndex: statementIndex,
                attribute: 'productDistributionPerNestingGroup',
                value: distrib
              });
            }}
            xlabel="enableProductDistributionPerNestingGroup"
            tickSize={13}
            helpUrl={cuttingOrderModeHelpUrl[5]}
          />
          <div />
          <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[6]}>
            {formatMessage({ id: 'rule.generate.cutting.order.product.distribution.per.nesting-group.max.number' })}
          </LabelWithHelpTooltip>
          <Input
            data-xlabel="productDistributionPerNestingGroupMaxNumberOD"
            onChange={({ target: { value } }) => {
              const distrib: DistributionPerGroup = statementResult.productDistributionPerNestingGroup
                ? {
                    ...statementResult.productDistributionPerNestingGroup,
                    maxNumberPerGroup: parseInt(value)
                  }
                : { enabled: false, maxNumberPerGroup: parseInt(value), groupDistribution: 0 };
              dispatch({
                type: 'UPDATE_STATEMENT_RESULT',
                activityId: 'generate-cutting-order',
                statementIndex,
                attribute: 'productDistributionPerNestingGroup',
                value: distrib
              });
            }}
            type="number"
            value={statementResult.productDistributionPerNestingGroup?.maxNumberPerGroup}
            disabled={disabled || (!statementResult.productDistributionPerNestingGroup?.enabled ?? true)}
            min={1}
            icon={<ErrorIcon errorKey={productDistributionPerNestingGroupValidationResult.error} />}
            error={!productDistributionPerNestingGroupValidationResult.isValid}
          />
          <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[7]}>
            {formatMessage({ id: 'rule.generate.cutting.order.product.distribution.per.nesting-group.distribution' })}
          </LabelWithHelpTooltip>
          <ItemsSwitcher
            data-xlabel="productDistributionPerNestingGroupOD"
            name="productDistributionPerNestingGroup"
            items={[
              { title: formatMessage({ id: 'common.balance' }), value: '0' },
              { title: formatMessage({ id: 'common.fill' }), value: '1' }
            ]}
            defaultValue={statementResult.productDistributionPerNestingGroup?.groupDistribution?.toString() ?? '1'}
            onChange={({ value }) => {
              const distrib: DistributionPerGroup = statementResult.productDistributionPerNestingGroup
                ? {
                    ...statementResult.productDistributionPerNestingGroup,
                    groupDistribution: parseInt(value)
                  }
                : { enabled: false, maxNumberPerGroup: 0, groupDistribution: parseInt(value) };
              dispatch({
                type: 'UPDATE_STATEMENT_RESULT',
                activityId: 'generate-cutting-order',
                statementIndex,
                attribute: 'productDistributionPerNestingGroup',
                value: distrib
              });
            }}
            disabled={disabled || (!statementResult.productDistributionPerNestingGroup?.enabled ?? true)}
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
