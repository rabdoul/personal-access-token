import React from 'react';
import styled from 'styled-components';
import CheckBox from '@lectra/checkbox';

import StepDescription from './StepDescription';
import ResultBlock from './ResultBlock';
import useRule from './useRule';
import { ValidateMTMProduct } from '../model';
import { useUIDispatch } from '../UIState';

const ValidateMTMProductRule = () => {
  const dispatch = useUIDispatch();
  const validateMTMProduct = useRule<'validate-mtm-product', ValidateMTMProduct>('validate-mtm-product', validateMTMProduct =>
    dispatch({
      type: 'INIT_VALIDATE_MTM_PRODUCT',
      validateMTMProduct
    })
  );
  if (!validateMTMProduct) return null;
  return (
    <Container>
      <StepDescription />
      <ResultBlock isDefault>
        <div>
          <CheckBox
            label="Request validation if an alteration does not appear in the recommended range"
            checked={validateMTMProduct.stopOnOutOfRangeWarning!}
            xlabel="stopOnOutOfRangeWarning"
          />
          <CheckBox
            label="Request validation if an alteration does not appear in the list of recommended strict values"
            checked={validateMTMProduct.stopOnIncorrectValueWarning!}
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
