import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
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
  const { formatMessage } = useIntl();
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
      <ResultBlock isDefault>
        <div>
          <CheckBox
            disabled={!editMode}
            label={formatMessage({ id: 'rule.sequencing.split.selection' })}
            checked={sequencing.splitCommandProducts!}
            onChange={value => updateSequencing('splitCommandProducts', value)}
          />
          {sequencing.splitCommandProducts && (
            <FormLine>
              <label htmlFor="orders-number">{formatMessage({ id: 'rule.sequencing.number.orders.sub.selection' })}</label>
              <Input
                disabled={!editMode}
                id="orders-number"
                type="number"
                numberMaxDigits={0}
                value={sequencing.numberOfProductOrders}
                width={50}
                error={invalidFields.has('numberOfProductOrders')}
                icon={<ErrorIcon errorKey="error.not.positive.field" />}
                min={0}
                onChange={evt => updateSequencing('numberOfProductOrders', evt.target.value, evt.target.value !== '' && evt.target.value !== '0')}
              />
            </FormLine>
          )}
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
