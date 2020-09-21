import React from 'react';
import styled from 'styled-components';
import CheckBox from '@lectra/checkbox';
import Input from '@lectra/input';
import { fetchData } from 'raspberry-fetch';
import { useQuery } from 'react-query';

import StepDescription from './StepDescription';
import { useAccessToken } from '../base/Authentication';
import { Sequencing } from '../model';
import RuleContainer from './RuleContainer';

const SequencingRules = () => {
  const accessToken = useAccessToken();
  const { data: sequencing } = useQuery<Sequencing>('setup-sequencing', () => {
    return fetchData(accessToken, '/activities/setup-sequencing');
  });

  if (!sequencing) return null;

  return (
    <Container>
      <StepDescription />
      <RuleContainer>
        <form>
          <CheckBox disabled label="Split the selection of product orders" checked={sequencing.splitCommandProducts} />
          <FormLine>
            <label htmlFor="orders-number">Number of product orders in the first sub-selection</label>
            <Input disabled id="orders-number" type="number" numberMaxDigits={0} value={sequencing.numberOfProductOrders} width={50} />
          </FormLine>
        </form>
      </RuleContainer>
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
    margin: 0px 5px 0px 5px;
    padding-right: 15px;
  }
`;

export default SequencingRules;
