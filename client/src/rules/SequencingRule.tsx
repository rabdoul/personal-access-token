import React, { useEffect } from 'react';
import styled from 'styled-components';
import CheckBox from '@lectra/checkbox';
import Input from '@lectra/input';
import { fetchData } from 'raspberry-fetch';
import { useQuery } from 'react-query';

import StepDescription from './StepDescription';
import { useAccessToken } from '../base/Authentication';
import { Sequencing } from '../model';
import ResultBlock from './ResultBlock';
import { useUIStateContext } from '../UIState';

const SequencingRule = () => {
  const accessToken = useAccessToken();
  const [{ editMode, 'setup-sequencing': setupSequencing }, dispatch] = useUIStateContext();

  const { data: sequencing, refetch } = useQuery<Sequencing>(
    ['setup-sequencing'],
    () => {
      return fetchData(accessToken, 'activities/setup-sequencing');
    },
    {
      enabled: false,
      onSuccess: data => {
        if (editMode) {
          dispatch({ type: 'INIT_SEQUENCING', sequencing: data });
        }
      }
    }
  );

  useEffect(() => {
    if (!setupSequencing) {
      refetch();
    }
  }, [editMode, setupSequencing]);

  const sequencingValues = editMode ? setupSequencing : sequencing;

  if (!sequencingValues) return null;
  return (
    <Container>
      <StepDescription />
      <ResultBlock>
        <form>
          <CheckBox
            disabled={!editMode}
            label="Split the selection of product orders"
            checked={sequencingValues.splitCommandProducts!}
            onChange={value => dispatch({ type: 'UPDATE_SEQUENCING', attribute: 'splitCommandProducts', value })}
          />
          {sequencingValues.splitCommandProducts && (
            <FormLine>
              <label htmlFor="orders-number">Number of product orders in the first sub-selection</label>
              <Input
                disabled={!editMode}
                id="orders-number"
                type="number"
                numberMaxDigits={0}
                value={sequencingValues.numberOfProductOrders}
                width={50}
                onChange={evt => dispatch({ type: 'UPDATE_SEQUENCING', attribute: 'numberOfProductOrders', value: evt.target.value })}
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
    margin: 0px 5px 0px 5px;
    padding-right: 15px;
  }
`;

export default SequencingRule;
