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
import useActivity from '../activities/useActivity';

const SequencingRule = () => {
  const { formatMessage } = useIntl();
  const [{ editMode }, dispatch] = useUIStateContext();

  const sequencing = useRule<'setup-sequencing', Sequencing>('setup-sequencing', sequencing => dispatch({ type: 'INIT_SEQUENCING', sequencing }));

  const { data: activity } = useActivity('setup-sequencing');

  const invalidFields = useRuleErrors('setup-sequencing');

  if (!sequencing || !activity) return null;

  const updateSequencing = (attribute: keyof Sequencing, value: any, isValid: boolean = true) => {
    dispatch({ type: 'UPDATE_SEQUENCING', attribute, value, isValid });
  };

  return (
    <Container>
      <StepDescription />
      <ResultBlock isDefault conditionned={activity.conditions.length > 0}>
        <FieldZone>
          <CheckBox
            disabled={!editMode}
            label={formatMessage({ id: 'rule.sequencing.split.selection' })}
            checked={sequencing.splitCommandProducts!}
            onChange={value => updateSequencing('splitCommandProducts', value)}
            xlabel="splitCommandProducts"
            tickSize={13}
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
