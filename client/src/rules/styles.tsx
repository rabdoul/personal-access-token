import styled from 'styled-components/macro';

export const Form = styled.form`
  span {
    font-weight: lighter;
    font-size: 14px;
  }

  [data-testId='CheckboxComponent'] {
    height: 14px;
    width: 14px;
  }
`;

export const FormLine = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  font-weight: lighter;

  input {
    margin-left: 5px;
  }
`;

export const BlockContent = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
  margin: 10px 0 10px 10px;
  width: 100%;
`;

export const BlockActions = styled.div`
  display: flex;
  margin-left: auto;

  button {
    margin-right: 10px;
  }
`;

export const BlockContainer = styled.div<{ marginLeft?: string }>`
  align-items: stretch;
  background-color: #fff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  height: auto;
  margin: 15px 0 15px ${props => props.marginLeft || '0'};
  min-width: 800px;
  width: fit-content;
`;

export const RuleContainer = styled.div`
  height: calc(100% - 95px);
  padding: 20px;
  width: calc(100% - 380px);
  overflow: auto;
`;

export const ConditionalInstructionContainer = styled.div<{ color: string }>`
  align-items: center;
  border-left: 5px solid ${props => props.color};
  display: flex;
  font-size: 14px;
  font-weight: 600;
  margin-right: 10px;
  padding-left: 10px;
`;