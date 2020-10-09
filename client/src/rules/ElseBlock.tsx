import React from 'react';
import BasicButton from '@lectra/basicbutton';
import Icon from '@lectra/icon';

import { ActivityId, useUIDispatch } from '../UIState';
import { BlockActions, BlockContainer, BlockContent } from './styled-components';
import ConditionalInstruction from './ConditionalInstruction';

interface Props {
  activityId: ActivityId;
  disabled: boolean;
}

const ElseBlock: React.FC<Props> = ({ activityId, disabled }) => {
  const dispatch = useUIDispatch();

  return (
    <BlockContainer>
      <ConditionalInstruction type={'ELSE'} />
      <BlockContent>
        <BlockActions>
          <BasicButton onClick={() => dispatch({ type: 'ADD_STATEMENT', activityId })} disabled={disabled} type={'white'}>
            <Icon type="add" size={14} />
          </BasicButton>
        </BlockActions>
      </BlockContent>
    </BlockContainer>
  );
};

export default ElseBlock;
