import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

interface Props {
  type: 'IF' | 'AND' | 'ELSE' | 'THEN' | 'DEFAULT';
}

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

const ConditionalInstruction: React.FC<Props> = ({ type }) => {
  const { formatMessage } = useIntl();

  return <Container color={getOperatorColor(type)}>{formatMessage({ id: `rule.${type.toLowerCase()}` })}</Container>;
};

export default ConditionalInstruction;

export const Container = styled.div<{ color: string }>`
  align-items: center;
  border-left: 5px solid ${props => props.color};
  display: flex;
  font-size: 14px;
  font-weight: 600;
  margin-right: 10px;
  padding-left: 10px;
`;
