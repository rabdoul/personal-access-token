import React from 'react';
import Icon from '@lectra/icon';
import Input from '@lectra/input';
import DropDownSearch from '@lectra/dropdownsearch';

import { ActivityConfiguration, Condition } from '../../model';
import { ActivityId, useUIDispatch } from '../../UIState';
import { BlockActions, BlockContainer, BlockContent, StyledSelect } from './styles';
import ConditionalInstruction from './ConditionalInstruction';
import useConditionConfiguration from './useConditionConfiguration';
import { MANDATORY_FIELD_ERROR } from './ErrorIcon';
import DropDownSearchRenderer from './DropDownSearchRenderer';
import { ButtonWithHelpTooltip, useHelpUrls } from '../../base/Help';
import InputLength from './InputLength';

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
  const urls = useHelpUrls('PP_ADD_CONDITION', 'PP_DELETE_CONDITION');

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
          <StyledSelect
            data-xlabel="multipleOperator"
            listItems={conditionConfiguration.multipleOperatorItems}
            value={condition.multipleOperator}
            onChange={item => dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'multipleOperator', value: item.value })}
            width={200}
            disabled={disabled}
          />
        )}
        <StyledSelect
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
        <StyledSelect
          data-xlabel="operator"
          listItems={conditionConfiguration.operators}
          value={condition.operator}
          onChange={item => dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'operator', value: item.value })}
          width={200}
          disabled={disabled}
          error={!condition.operator}
          icon={MANDATORY_FIELD_ERROR}
        />
        {((conditionConfiguration.type === 'number' && !conditionConfiguration.unitConfig) || conditionConfiguration.type === 'text') && (
          <Input
            data-xlabel="right-operand"
            type={conditionConfiguration.type}
            value={condition.value}
            onChange={handleConditionInputValueChange}
            width={200}
            disabled={disabled}
            error={!condition.value}
            icon={MANDATORY_FIELD_ERROR}
          />
        )}
        {conditionConfiguration.type === 'number' && conditionConfiguration.unitConfig && (
          <InputLength
            xlabel="right-operand"
            valueInMeter={parseFloat(condition.value)}
            onValueUpdate={value => dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'value', value })}
            width={200}
            targetUnit={conditionConfiguration.unitConfig}
            disabled={disabled}
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
            customRenderSelection={(item: any) => (
              <DropDownSearchRenderer
                item={item}
                disabled={disabled}
                onDelete={() => dispatch({ type: 'UPDATE_CONDITION', activityId, statementIndex, conditionIndex, attribute: 'value', value: undefined })}
              />
            )}
            icon={MANDATORY_FIELD_ERROR}
          />
        )}
        <BlockActions>
          <ButtonWithHelpTooltip
            helpUrl={urls[0]}
            onClick={() => dispatch({ type: 'ADD_CONDITION', activityId, statementIndex, conditionIndex: conditionIndex + 1 })}
            disabled={disabled}
            type={'white'}
          >
            <Icon type="add" size={14} />
          </ButtonWithHelpTooltip>
          <ButtonWithHelpTooltip
            helpUrl={urls[1]}
            onClick={() => dispatch({ type: 'DELETE_CONDITION', activityId, statementIndex, conditionIndex })}
            disabled={disabled}
            type={'white'}
          >
            <Icon type="delete" size={14} />
          </ButtonWithHelpTooltip>
        </BlockActions>
      </BlockContent>
    </BlockContainer>
  );
};

export default ConditionBlock;
