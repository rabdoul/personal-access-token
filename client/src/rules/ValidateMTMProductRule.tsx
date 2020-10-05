import React from 'react';
import styled from 'styled-components';
import CheckBox from '@lectra/checkbox';

import StepDescription from './StepDescription';
import ResultBlock from './ResultBlock';
import useRule from './useRule';
import { ValidateMTMProduct } from '../model';
import { useUIStateContext } from '../UIState';
import { useIntl } from 'react-intl';
import useActivityConfiguration from '../activities/useActivityConfiguration';

const ValidateMTMProductRule = () => {
  const { formatMessage } = useIntl();
  const [{ editMode }, dispatch] = useUIStateContext();

  const validateMTMProduct = useRule<'validate-mtm-product', ValidateMTMProduct>('validate-mtm-product', validateMTMProduct =>
    dispatch({ type: 'INIT_VALIDATE_MTM_PRODUCT', validateMTMProduct })
  );
  const { data: activityConfiguration } = useActivityConfiguration('validate-mtm-product');

  if (!validateMTMProduct || !activityConfiguration) return null;

  const updateValidateMTMProduct = (attribute: keyof ValidateMTMProduct, value: any) => {
    dispatch({ type: 'UPDATE_VALIDATE_MTM_PRODUCT', attribute, value, isValid: true });
  };

  return (
    <Container>
      <StepDescription />
      <ResultBlock isDefault disabled={!editMode} conditionned={activityConfiguration.conditions.length > 0}>
        <FieldZone>
          <CheckBox
            disabled={!editMode}
            label={formatMessage({ id: 'rule.validate.mtm.product.stop.out.of.range' })}
            checked={validateMTMProduct.stopOnOutOfRangeWarning!}
            onChange={value => updateValidateMTMProduct('stopOnOutOfRangeWarning', value)}
            xlabel="stopOnOutOfRangeWarning"
            tickSize={13}
          />
          <CheckBox
            disabled={!editMode}
            label={formatMessage({ id: 'rule.validate.mtm.product.stop.incorrect.value' })}
            checked={validateMTMProduct.stopOnIncorrectValueWarning!}
            onChange={value => updateValidateMTMProduct('stopOnIncorrectValueWarning', value)}
            xlabel="stopOnIncorrectValueWarning"
            tickSize={13}
          />
        </FieldZone>
      </ResultBlock>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100% - 95px);
  padding: 20px;
  width: calc(100% - 380px);
`;

const FieldZone = styled.div`
  span {
    font-weight: lighter;
    font-size: 14px;
  }

  [data-testId='CheckboxComponent'] {
    height: 14px;
    width: 14px;
  }
`;

export default ValidateMTMProductRule;
