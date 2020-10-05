import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

const ResultBlock: React.FC<{ children: React.ReactNode; isDefault: boolean; conditionned: boolean }> = ({ children, isDefault, conditionned }) => {
  const { formatMessage } = useIntl();
  return (
    <Container isDefault={isDefault}>
      <Operator>{formatMessage({ id: isDefault ? 'rule.default' : 'rule.then' })}</Operator>
      {children}
      {conditionned && <button>+</button>}
    </Container>
  );
};

const Container = styled.div<{ isDefault: boolean }>`
  align-items: center;
  background-color: #fff;
  border-left: ${props => (props.isDefault ? 'none' : '5px solid #26a3ff')};
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  margin-left: ${props => (props.isDefault ? '0' : '20px')};
  width: 800px;
  padding: 10px;
`;

const Operator = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin: 0 20px 0 10px;
`;

export default ResultBlock;
