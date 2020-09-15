import * as React from 'react';
import styled from 'styled-components';
import Loader from '@lectra/loader';

const LoadingScreen = () => {
  return (
    <Container>
      <Loader loading />
    </Container>
  );
};

export default LoadingScreen;

const Container = styled.div`
  align-items: center;
  background-color: #e8e8e8;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;

  & :first-child {
    background-color: #e8e8e8;
  }
`;
