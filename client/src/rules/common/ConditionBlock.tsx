import React from 'react';
import BasicButton from '@lectra/basicbutton';
import Icon from '@lectra/icon';
import Input from '@lectra/input';
import Select from '@lectra/select';
import DropDownSearch from '@lectra/dropdownsearch';

import { ActivityConfiguration, Condition } from '../../model';
import { ActivityId, useUIDispatch } from '../../UIState';
import { BlockActions, BlockContainer, BlockContent } from './styles';
import ConditionalInstruction from './ConditionalInstruction';
import useConditionConfiguration from './useConditionConfiguration';
import { MANDATORY_FIELD_ERROR } from './ErrorIcon';

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
            listItems={conditionConfiguration.listItems}
            width={200}
            value={condition.value}
            onChange={item => dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'value', value: item?.value })}
            disabled={disabled}
            error={!condition.value}
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
