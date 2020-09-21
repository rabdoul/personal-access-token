import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import StepDescription from './StepDescription';

const Sequencing = () => {
  useQuery('/api/activities/setup-sequencing');

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
