import React from 'react';
import BasicButton from '@lectra/basicbutton';
import Icon from '@lectra/icon';
import { ActivityId, useUIDispatch } from '../../UIState';
import ConditionalInstruction from './ConditionalInstruction';
import { BlockActions, BlockContainer, BlockContent } from './styles';

type Props = {
  activityId: ActivityId;
  conditional: boolean;
  isDefault: boolean;
  disabled: boolean;
  xid: number;
};

const ResultBlock: React.FC<Props> = ({ children, activityId, conditional, isDefault, disabled, xid }) => {
  const dispatch = useUIDispatch();

  return (
    <BlockContainer data-resultblock-id={xid} marginLeft={isDefault ? '0' : '15px'}>
      <ConditionalInstruction type={isDefault ? 'DEFAULT' : 'THEN'} />
      <BlockContent>
        {children}
        {conditional && isDefault && (
          <BlockActions>
            <BasicButton onClick={() => dispatch({ type: 'ADD_STATEMENT', activityId })} disabled={disabled} type={'white'}>
              <Icon type="add" size={14} />
            </BasicButton>
          </BlockActions>
        )}
      </BlockContent>
    </BlockContainer>
  );
};

export default ResultBlock;
