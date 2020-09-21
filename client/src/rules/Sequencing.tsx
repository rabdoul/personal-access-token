import { fetchData } from 'raspberry-fetch';
import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { useAccessToken } from '../base/Authentication';
import StepDescription from './StepDescription';

const Sequencing = () => {
  const accessToken = useAccessToken();
  const { isLoading, isError, data: sequencing } = useQuery('setup-sequencing', () => {
    fetchData(accessToken, '/activities/setup-sequencing');
  });

  return (
    <Container>
      <StepDescription />
    </Container>
  );
};

const Container = styled.div`
  height: calc(100% - 95px);
  padding: 20px;
  width: calc(100% - 380px);
`;

export default Sequencing;
