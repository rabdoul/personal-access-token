import React from 'react';
import { useIntl } from 'react-intl';
import { ConditionalInstructionContainer } from './styles';

const getOperatorColor = (type: string) => {
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

const ConditionalInstruction: React.FC<{ type: 'IF' | 'AND' | 'ELSE' | 'THEN' | 'DEFAULT' }> = ({ type }) => {
  const { formatMessage } = useIntl();
  return <ConditionalInstructionContainer color={getOperatorColor(type)}>{formatMessage({ id: `rule.${type.toLowerCase()}` })}</ConditionalInstructionContainer>;
};

export default ConditionalInstruction;
