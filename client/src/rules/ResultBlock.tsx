import React from 'react';
import styled from 'styled-components';

const ResultBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Container>
      <X>Default</X>
      {children}
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  width: 800px;
  padding: 10px;
`;

const X = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin: 0 20px 0 10px;
`;

export default ResultBlock;
