import React from 'react';
import BasicButton from '@lectra/basicbutton';
import Icon from '@lectra/icon';
import IconButton from '@lectra/iconbutton';
import Input from '@lectra/input';
import Select from '@lectra/select';
import SpanTooltip from '@lectra/spantooltip';
import DropDownSearch from '@lectra/dropdownsearch';

import { ActivityConfiguration, Condition } from '../../model';
import { ActivityId, useUIDispatch } from '../../UIState';
import { BlockActions, BlockContainer, BlockContent } from './styles';
import ConditionalInstruction from './ConditionalInstruction';
import useConditionConfiguration from './useConditionConfiguration';
import { MANDATORY_FIELD_ERROR } from './ErrorIcon';
import styled from 'styled-components/macro';

type Props = {
  statementIndex: number;
  condition: Condition;
  conditionIndex: number;
  activityConfiguration: ActivityConfiguration;
  disabled: boolean;
  xid: string;
};

const ConditionBlock: React.FC<Props> = ({ statementIndex, condition, conditionIndex, activityConfiguration, disabled, xid }) => {
  const dispatch = useUIDispatch();
  const conditionConfiguration = useConditionConfiguration(condition, activityConfiguration);
  const activityId = activityConfiguration.id as ActivityId;

  const handleConditionInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue, type } = event.target;
    let value;
    if (inputValue) {
      value = type === 'number' ? parseFloat(inputValue) : inputValue;
    }
    dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'value', value });
  };

  const customRenderDropDownSearchSelection = (data: any) => {
    return (
      data && (
        <ContainerSelection disabled={disabled}>
          <div style={{ width: '150px' }}>
            <SpanTooltip text={data.label} />
          </div>
          <IconButton onClick={() => dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'value', value: undefined })}>
            <IconDelete color="#a5aaae" size={13} type="delete" disabled={disabled} />
          </IconButton>
        </ContainerSelection>
      )
    );
  };

  return (
    <BlockContainer data-conditionblock-id={xid}>
      {statementIndex > 0 && conditionIndex === 0 && <ConditionalInstruction type={'ELSE'} />}
      <ConditionalInstruction type={conditionIndex === 0 ? 'IF' : 'AND'} />
      <BlockContent>
        {conditionConfiguration.multipleOperatorItems && (
          <Select
            data-xlabel="multipleOperator"
            listItems={conditionConfiguration.multipleOperatorItems}
            value={condition.multipleOperator}
            onChange={item => dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'multipleOperator', value: item.value })}
            width={200}
            disabled={disabled}
          />
        )}
        <Select
          data-xlabel="left-operand"
          listItems={conditionConfiguration.references}
          value={condition.reference}
          onChange={item => {
            dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'reference', value: item.value });
            const multipleOperator = activityConfiguration.conditions.find(condition => condition.reference === item.value)?.multipleOperators[0];
            dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'multipleOperator', value: multipleOperator });
          }}
          width={200}
          disabled={disabled}
          error={!condition.reference}
          icon={MANDATORY_FIELD_ERROR}
        />
        <Select
          data-xlabel="operator"
          listItems={conditionConfiguration.operators}
          value={condition.operator}
          onChange={item => dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'operator', value: item.value })}
          width={200}
          disabled={disabled}
          error={!condition.operator}
          icon={MANDATORY_FIELD_ERROR}
        />
        {(conditionConfiguration.type === 'number' || conditionConfiguration.type === 'text') && (
          <Input
            data-xlabel="right-operand"
            type={conditionConfiguration.type}
            value={condition.value}
            onBlur={handleConditionInputValueChange}
            width={200}
            disabled={disabled}
            error={!condition.value}
            icon={MANDATORY_FIELD_ERROR}
          />
        )}
        {conditionConfiguration.type === 'list' && (
          <DropDownSearch
            data-xlabel="right-operand"
            listItems={conditionConfiguration.listItems}
            width={200}
            value={condition.value}
            onChange={item => dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'value', value: item?.value })}
            disabled={disabled}
            error={!condition.value}
            customRenderSelection={customRenderDropDownSearchSelection}
            icon={MANDATORY_FIELD_ERROR}
          />
        )}
        <BlockActions>
          <BasicButton onClick={() => dispatch({ type: 'ADD_CONDITION', activityId, statementIndex, conditionIndex: conditionIndex + 1 })} disabled={disabled} type={'white'}>
            <Icon type="add" size={14} />
          </BasicButton>
          <BasicButton onClick={() => dispatch({ type: 'DELETE_CONDITION', activityId, statementIndex, conditionIndex })} disabled={disabled} type={'white'}>
            <Icon type="delete" size={14} />
          </BasicButton>
        </BlockActions>
      </BlockContent>
    </BlockContainer>
  );
};

export default ConditionBlock;

const ContainerSelection = styled.div<{ disabled: boolean }>`
  align-items: center;
  background-color: ${props => (props.disabled ? '#E6E6E6' : 'white')};
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-radius: 2px;
  border-right: 1px solid #ccc;
  border-top: 3px solid #16a086;
  display: flex;
  justify-content: space-between;
  height: 34px;
  padding: 0 10px 0 5px;
  opacity: ${props => (props.disabled ? '0.3' : '1')};
  width: 200px;
`;

const IconDelete = styled(Icon)<{ disabled: boolean }>`
  align-items: center;
  display: ${props => (props.disabled ? 'none' : 'flex')};

  &:hover {
    color: #747d82;
  }

  &:active {
    color: #5c5f61;
  }
`;
