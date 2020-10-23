import React, { Fragment } from 'react';
import Select from '@lectra/select';
import { useIntl } from 'react-intl';

import { LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import { StatementResult } from '../model';
import { useUIDispatch } from '../UIState';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';

export interface GenerateCuttingOrder extends StatementResult {
  productGrouping: number;
  materialGrouping: number;
  canMixCommands: boolean; // TODO: to remove when GenerateCuttingOrderODRule removed
  maxNumberOfProducts: number; // TODO: to remove when GenerateCuttingOrderODRule removed
  groupDistribution: number; // TODO: to remove when GenerateCuttingOrderODRule removed
}

const GenerateCuttingOrderRule = () => <Rule activityId={'generate-cutting-order'}>{props => <GenerateCuttingOrderForm {...props} />}</Rule>;

const GenerateCuttingOrderForm: React.FC<StatementResultFormProps<GenerateCuttingOrder>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const cuttingOrderModeHelpUrl = useHelpUrls('PP_GENERATE_CUTTING_ORDERS_MODE');

  const productGroupingListItems = [
    { value: '0', label: formatMessage({ id: 'rule.generate.cutting.order.one.per.product' }) },
    { value: '4', label: formatMessage({ id: 'rule.generate.cutting.order.not.generate' }) },
    { value: '5', label: formatMessage({ id: 'rule.generate.cutting.order.mixing.product.no.mixing.commands' }) },
    { value: '6', label: formatMessage({ id: 'rule.generate.cutting.order.mixing.product.mixing.commands' }) }
  ];

  const materialGroupingListItems = [
    { value: '0', label: formatMessage({ id: 'rule.generate.cutting.order.one.per.material' }) },
    { value: '1', label: formatMessage({ id: 'rule.generate.cutting.order.with.equivalent.material' }) }
  ];

  return (
    <Form>
      <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[0]}>{formatMessage({ id: 'rule.generate.cutting.order.generation.mode' })}</LabelWithHelpTooltip>
      <Select
        data-xlabel="cuttingOrderProductGrouping"
        listItems={productGroupingListItems}
        value={`${statementResult.productGrouping ?? 4}`}
        onChange={({ value }) =>
          dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-cutting-order', statementIndex, attribute: 'productGrouping', value: parseInt(value) })
        }
        width={350}
        disabled={disabled}
      />
      {statementResult.productGrouping !== 4 && statementResult.productGrouping !== undefined ? (
        <Fragment>
          <LabelWithHelpTooltip helpUrl={cuttingOrderModeHelpUrl[0]}>{formatMessage({ id: 'rule.generate.cutting.order.material.grouping' })}</LabelWithHelpTooltip>
          <Select
            data-xlabel="cuttingOrderMaterialGrouping"
            listItems={materialGroupingListItems}
            value={`${statementResult.materialGrouping ?? 0}`}
            onChange={({ value }) =>
              dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-cutting-order', statementIndex, attribute: 'materialGrouping', value: parseInt(value) })
            }
            width={350}
            disabled={disabled}
          />
        </Fragment>
      ) : null}
    </Form>
  );
};

export default GenerateCuttingOrderRule;
