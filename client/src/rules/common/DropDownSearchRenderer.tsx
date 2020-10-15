import React from 'react';
import SpanTooltip from '@lectra/spantooltip';
import IconButton from '@lectra/iconbutton';

import { SelectionContainer, IconDelete } from './styles';

type Props = {
  item?: { label: string; value: string };
  disabled: boolean;
  onDelete: () => void;
};

const DropDownSearchRenderer: React.FC<Props> = ({ item, disabled, onDelete }) => {
  if (!item) return null;

  return (
    <SelectionContainer disabled={disabled}>
      <div style={{ width: '150px' }}>
        <SpanTooltip text={item.label} />
      </div>
      <IconButton onClick={onDelete}>
        <IconDelete color="#a5aaae" size={13} type="delete" disabled={disabled} />
      </IconButton>
    </SelectionContainer>
  );
};

export default DropDownSearchRenderer;
