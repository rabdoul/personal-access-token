import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import useActivityConfiguration from '../activities/useActivityConfiguration';

import Select from '@lectra/select';
import { useUIState, useUIDispatch } from '../UIState';
import { LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import useRule from './common/useRule';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';
import useRuleValidator from './common/useRuleValidator';
import { StatementResult } from '../model';

export interface GenerateCuttingOrder extends StatementResult {
  productGrouping: number;
  materialGrouping: number;
  canMixCommands: boolean; // TODO: to remove when GenerateCuttingOrderODRule removed
  maxNumberOfProducts: number; // TODO: to remove when GenerateCuttingOrderODRule removed
  groupDistribution: number; // TODO: to remove when GenerateCuttingOrderODRule removed
}

const GenerateCuttingOrderRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('generate-cutting-order');
  const activityConfiguration = useActivityConfiguration('generate-cutting-order');
  useRuleValidator('generate-cutting-order', rule);

  return (
    <Rule disabled={!editMode} activityConfiguration={activityConfiguration} rule={rule}>
      {props => <GenerateCuttingOrderForm {...props} />}
    </Rule>
  );
};

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
