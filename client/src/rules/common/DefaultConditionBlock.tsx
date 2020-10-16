import React from 'react';
import BasicButton from '@lectra/basicbutton';
import Icon from '@lectra/icon';

import { ActivityId, useUIDispatch } from '../../UIState';
import { BlockActions, BlockContainer, BlockContent } from './styles';
import ConditionalInstruction from './ConditionalInstruction';
import { useHelpUrls, withHelpTooltip } from '../../base/Help';

type Props = {
  activityId: ActivityId;
  disabled: boolean;
};

const DefaultConditionBlock: React.FC<Props> = ({ activityId, disabled }) => {
  const dispatch = useUIDispatch();
  const urls = useHelpUrls('PP_ADD_CONDITION');

  return (
    <BlockContainer data-conditionblock-id="else">
      <ConditionalInstruction type={'ELSE'} />
      <BlockContent>
        <BlockActions>
          <ActionButton helpUrl={urls[0]} onClick={() => dispatch({ type: 'ADD_STATEMENT', activityId })} disabled={disabled} type={'white'}>
            <Icon type="add" size={14} />
          </ActionButton>
        </BlockActions>
      </BlockContent>
    </BlockContainer>
  );
};

const ActionButton = withHelpTooltip(BasicButton);

export default DefaultConditionBlock;
