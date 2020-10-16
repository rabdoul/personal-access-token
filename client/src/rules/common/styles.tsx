import Icon from '@lectra/icon';
import styled from 'styled-components/macro';
import { withHelpTooltip } from '../../base/Help';
import Input from '@lectra/input';

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

export const FormLine = withHelpTooltip(styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  font-weight: lighter;

  label {
    margin-right: 5px;
  }
`);

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

export const ConditionalInstructionContainer = withHelpTooltip(styled.div<{ color: string }>`
  align-items: center;
  border-left: 5px solid ${props => props.color};
  display: flex;
  font-size: 14px;
  font-weight: 600;
  margin-right: 10px;
  padding-left: 10px;
`);

export const SelectionContainer = styled.div<{ disabled: boolean }>`
  align-items: center;
  background-color: ${props => (props.disabled ? '#E6E6E6' : 'white')};
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-radius: 2px;
  border-right: 1px solid #ccc;
  border-top: 3px solid #16a086;
  display: flex;
  justify-content: space-between;
  height: 34px;
  padding: 0 10px 0 5px;
  opacity: ${props => (props.disabled ? '0.3' : '1')};
  width: 200px;
`;

export const IconDelete = styled(Icon)<{ disabled: boolean }>`
  align-items: center;
  display: ${props => (props.disabled ? 'none' : 'flex')};

  &:hover {
    color: #747d82;
  }

  &:active {
    color: #5c5f61;
  }
`;

export const EfficiencyNumbersContainer = styled.div`
  align-items: center;
  display: flex;
  height: 35px;
  justify-content: space-between;
  margin-bottom: 5px;
  position: relative;
  width: 280px;

  .KUISpanTooltip {
    width: 40px;
  }
`;

export const EfficiencyContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 280px;
`;

export const FromInput = styled(Input)`
  position: absolute;
  left: 40px;
`;

export const ToInput = styled(Input)`
  position: absolute;
  right: 43px;
`;

export const EfficiencyImg = styled.div`
  background-image: url('/assets/Gauge.png');
  background-repeat: no-repeat;
  height: 35px;
  width: 280px;
`;
