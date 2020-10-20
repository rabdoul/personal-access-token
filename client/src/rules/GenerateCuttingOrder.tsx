import React from 'react';
import { useIntl } from 'react-intl';
import useActivityConfiguration from '../activities/useActivityConfiguration';

import Select from '@lectra/select';
import { StatementResult } from '../model';
import { useUIState, useUIDispatch, ActivityId } from '../UIState';
import { useHelpUrls } from '../base/Help';
import StepDescription from './common/StepDescription';
import useRule from './common/useRule';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form, FormLine } from './common/styles';
import useRuleValidator from './common/useRuleValidator';
import styled from 'styled-components';

export interface GenerateCuttingOrder extends StatementResult {
  productGrouping: number;
  materialGrouping: number;
}

const GenerateCuttingOrder: React.FC = () => {
  const generateCTO = useRule('generate-cutting-order');
  const activityConfiguration = useActivityConfiguration('generate-cutting-order');
  const { editMode } = useUIState();
  useRuleValidator(activityConfiguration?.id as ActivityId | undefined, generateCTO);
  if (generateCTO !== undefined && activityConfiguration !== undefined) {
    return (
      <Rule disabled={!editMode} activityConfiguration={activityConfiguration} rule={generateCTO}>
        {props => <GenerateCuttingOrderForm {...props} />}
      </Rule>
    );
  } else {
    return <StepDescription />;
  }
};

const GenerateCuttingOrderForm: React.FC<StatementResultFormProps<GenerateCuttingOrder>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const cuttingOrderModeHelpUrl = useHelpUrls('PP_GENERATE_CUTTING_ORDERS_MODE');

  const productGroupingListItems = [
    { value: '0', label: `${formatMessage({ id: 'rule.generate.cutting.order.one.per.product' })}` },
    { value: '4', label: `${formatMessage({ id: 'rule.generate.cutting.order.not.generate' })}` },
    { value: '5', label: `${formatMessage({ id: 'rule.generate.cutting.order.mixing.product.no.mixing.commands' })}` },
    { value: '6', label: `${formatMessage({ id: 'rule.generate.cutting.order.mixing.product.mixing.commands' })}` }
  ];

  const materialGroupingListItems = [
    { value: '0', label: `${formatMessage({ id: 'rule.generate.cutting.order.one.per.material' })}` },
    { value: '1', label: `${formatMessage({ id: 'rule.generate.cutting.order.with.equivalent.material' })}` }
  ];

  return (
    <Form>
      <FormLine helpUrl={cuttingOrderModeHelpUrl[0]}>
        <SelectLabel>{formatMessage({ id: 'rule.generate.cutting.order.generation.mode' })}</SelectLabel>
        <Select
          name="cuttingOrderProductGrouping"
          x-label="cuttingOrderProductGrouping"
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
        <FormLine helpUrl={cuttingOrderModeHelpUrl[0]}>
          <SelectLabel>{formatMessage({ id: 'rule.generate.cutting.order.material.grouping' })}</SelectLabel>
          <Select
            name="cuttingOrderMaterialGrouping"
            x-label="cuttingOrderMaterialGrouping"
            style={{ marginTop: '10px' }}
            listItems={materialGroupingListItems}
            value={`${statementResult.materialGrouping ?? 0}`}
            onChange={({ value }) =>
              dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'generate-cutting-order', statementIndex, attribute: 'materialGrouping', value: parseInt(value) })
            }
            width={300}
            disabled={disabled}
          />
        </FormLine>
      ) : null}
    </Form>
  );
};

const SelectLabel = styled.div`
  width: 250px;
`;

export default GenerateCuttingOrder;
