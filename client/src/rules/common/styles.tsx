import Icon from '@lectra/icon';
import styled from 'styled-components/macro';
import { withHelpTooltip } from '../../base/Help';
import Input from '@lectra/input';
import Select from '@lectra/select';

export const Form = styled.div`
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
  margin: 2px 0;

  label {
    margin-right: 20px;
  }
`);

export const BlockContent = styled.div`
  align-items: center;
  display: flex;
  margin: 10px 0 10px 10px;
  width: 100%;

  & > div {
    margin-right: 10px;
  }
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

export const StyledSelect = styled(Select)`
  width: 200px !important;
`;

export const StyledSmallSelect = styled(Select)`
  .KUISelect__control {
    min-width: 50px !important;
    width: 50px !important;
  }

  .KUISelect.error__control {
    min-width: 50px !important;
    width: 50px !important;
  }
`;

export const RuleContainer = styled.div`
  height: calc(100% - 95px);
  padding: 20px;
  width: calc(100% - 380px);
  overflow: auto;
`;

export const ConditionalInstructionContainer = withHelpTooltip(styled.div<{ color: string; withTooltip: boolean }>`
  align-items: center;
  border-left: 5px solid ${props => props.color};
  display: flex;
  font-size: 14px;
  font-weight: 600;
  margin-right: 10px;
  padding-left: 10px;
  height: ${props => (!props.withTooltip ? 'inherit' : '100%')};
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

export const FromInput = styled(Input)<{ error: boolean }>`
  position: absolute;
  left: 40px;

  input {
    padding-left: 0;
    padding-right: ${props => (props.error ? '22px' : '10px')} !important;
  }
`;

export const ToInput = styled(Input)<{ error: boolean }>`
  position: absolute;
  right: 43px;

  input {
    padding-left: 0;
    padding-right: ${props => (props.error ? '22px' : '10px')} !important;
  }
`;

export const EfficiencyImg = styled.div`
  background-image: url('/assets/Gauge.png');
  background-repeat: no-repeat;
  height: 35px;
  width: 280px;
`;

export const CriterionsContainer = styled.div`
  border: 1px solid #333;
  margin-top: 15px;
  padding: 10px 20px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  margin-left: 99px;
  gap: 10px;
`;

export const FormLabel = styled.div`
  align-items: center;
  display: flex;
  margin-right: 10px;
  width: 340px;
`;

export const CriteriaLabel = withHelpTooltip(styled.div`
  margin-right: 10px;
  width: 170px;
`);

export const InputNumberWithError = styled(Input)<{ error: boolean }>`
  input {
    padding-left: 0;
    padding-right: ${props => (props.error ? '22px' : '10px')} !important;
  }
`;

export const SelectWithError = styled(Select)<{ error: boolean }>`
  max-width: ${props => props.width}px !important;
`;
