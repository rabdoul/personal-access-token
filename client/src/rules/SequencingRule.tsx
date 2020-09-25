import React from 'react';
import styled from 'styled-components';
import CheckBox from '@lectra/checkbox';
import Input from '@lectra/input';

import StepDescription from './StepDescription';
import { Sequencing } from '../model';
import ResultBlock from './ResultBlock';
import { useUIStateContext } from '../UIState';
import useRule from './useRule';
import useRuleErrors from './useRuleErrors';
import ErrorIcon from '../common/ErrorIcon';

const SequencingRule = () => {
  const [{ editMode }, dispatch] = useUIStateContext();

  const sequencing = useRule<'setup-sequencing', Sequencing>('setup-sequencing', sequencing => dispatch({ type: 'INIT_SEQUENCING', sequencing }));
  const invalidFields = useRuleErrors('setup-sequencing');

  if (!sequencing) return null;

  const updateSequencing = (attribute: keyof Sequencing, value: any, isValid: boolean = true) => {
    dispatch({ type: 'UPDATE_SEQUENCING', attribute, value, isValid });
  };

  return (
    <Container>
      <StepDescription />
      <ResultBlock>
        <form>
          <CheckBox
            disabled={!editMode}
            label="Split the selection of product orders"
            checked={sequencing.splitCommandProducts!}
            onChange={value => updateSequencing('splitCommandProducts', value)}
          />
          {sequencing.splitCommandProducts && (
            <FormLine>
              <label htmlFor="orders-number">Number of product orders in the first sub-selection</label>
              <Input
                disabled={!editMode}
                id="orders-number"
                type="number"
                numberMaxDigits={0}
                value={sequencing.numberOfProductOrders}
                width={50}
                error={invalidFields.has('numberOfProductOrders')}
                icon={<ErrorIcon errorKey="toBeDefined" />}
                min={0}
                onChange={evt => updateSequencing('numberOfProductOrders', evt.target.value, evt.target.value !== '' && evt.target.value !== '0')}
              />
            </FormLine>
          )}
        </form>
      </ResultBlock>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100% - 95px);
  padding: 20px;
  width: calc(100% - 380px);
`;

const FormLine = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  font-weight: lighter;

  input {
    margin-left: 5px;
  }
`;

export default SequencingRule;
