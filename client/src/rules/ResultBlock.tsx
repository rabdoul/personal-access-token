import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import BasicButton from '@lectra/basicbutton';
import Icon from '@lectra/icon';

const ResultBlock: React.FC<{ children: React.ReactNode; isDefault: boolean; conditionned: boolean; disabled: boolean }> = ({ children, isDefault, conditionned, disabled }) => {
  const { formatMessage } = useIntl();
  return (
    <Container isDefault={isDefault}>
      <Operator>{formatMessage({ id: isDefault ? 'rule.default' : 'rule.then' })}</Operator>
      {children}
      {conditionned && (
        <BasicButton onClick={() => {}} disabled={disabled} type={'white'}>
          <Icon type="add" size={14} />
        </BasicButton>
      )}
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

  button {
    margin-left: auto;
  }
`;

const Operator = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin: 0 20px 0 10px;
`;

export default ResultBlock;
