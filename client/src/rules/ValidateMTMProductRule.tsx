import React from 'react';
import styled from 'styled-components';
import CheckBox from '@lectra/checkbox';

import StepDescription from './StepDescription';
import ResultBlock from './ResultBlock';
import useRule from './useRule';
import { Sequencing, ValidateMTMProduct } from '../model';
import { useUIStateContext } from '../UIState';
import { useIntl } from 'react-intl';

const ValidateMTMProductRule = () => {
  const { formatMessage } = useIntl();
  const [{ editMode }, dispatch] = useUIStateContext();

  const validateMTMProduct = useRule<'validate-mtm-product', ValidateMTMProduct>('validate-mtm-product', validateMTMProduct =>
    dispatch({
      type: 'INIT_VALIDATE_MTM_PRODUCT',
      validateMTMProduct
    })
  );
  if (!validateMTMProduct) return null;

  const updateValidateMTMProduct = (attribute: keyof ValidateMTMProduct, value: any) => {
    dispatch({ type: 'UPDATE_VALIDATE_MTM_PRODUCT', attribute, value, isValid: true });
  };

  return (
    <Container>
      <StepDescription />
      <ResultBlock isDefault>
        <div>
          <CheckBox
            disabled={!editMode}
            label={formatMessage({ id: 'Request validation if an alteration does not appear in the recommended range' })}
            checked={validateMTMProduct.stopOnOutOfRangeWarning!}
            onChange={value => updateValidateMTMProduct('stopOnOutOfRangeWarning', value)}
            xlabel="stopOnOutOfRangeWarning"
          />
          <CheckBox
            disabled={!editMode}
            label={formatMessage({ id: 'Request validation if an alteration does not appear in the list of recommended strict values' })}
            checked={validateMTMProduct.stopOnIncorrectValueWarning!}
            onChange={value => updateValidateMTMProduct('stopOnIncorrectValueWarning', value)}
            xlabel="stopOnIncorrectValueWarning"
          />
        </div>
      </ResultBlock>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100% - 95px);
  padding: 20px;
  width: calc(100% - 380px);
`;

export default ValidateMTMProductRule;
