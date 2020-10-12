import React from 'react';
import { useIntl } from 'react-intl';
import { ConditionalInstructionContainer } from './styles';

type Props = { type: 'IF' | 'AND' | 'ELSE' | 'THEN' | 'DEFAULT' };

const useOperatorColor = (type: string) => {
  switch (type) {
    case 'IF':
    case 'AND':
      return '#7bb928';
    case 'ELSE':
      return '#f1c40f';
    case 'THEN':
      return '#26a3ff';
    default:
      return 'transparent';
  }
};

const ConditionalInstruction: React.FC<Props> = ({ type }) => {
  const { formatMessage } = useIntl();
  let color = useOperatorColor(type);
  return <ConditionalInstructionContainer color={color}>{formatMessage({ id: `rule.${type.toLowerCase()}` })}</ConditionalInstructionContainer>;
};

export default ConditionalInstruction;
