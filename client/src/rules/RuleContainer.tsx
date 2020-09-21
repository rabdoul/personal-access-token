import React from 'react';
import styled from 'styled-components';

const RuleContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Container>
      <div>Default</div>
      {children}
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  border: 1px solid #999;
  border-radius: 3px;
  display: flex;
  padding: 5px;
`;

export default RuleContainer;
