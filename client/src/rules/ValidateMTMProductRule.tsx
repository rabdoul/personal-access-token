import React from 'react';
import styled from 'styled-components';
import CheckBox from '@lectra/checkbox';

import StepDescription from './StepDescription';
import ResultBlock from './ResultBlock';

const ValidateMTMProductRule = () => {
  return (
    <Container>
      <StepDescription />
      <ResultBlock isDefault>
        <div>
          <CheckBox label="Request validation if an alteration does not appear in the recommended range" checked={true} />
          <CheckBox label="Request validation if an alteration does not appear in the list of recommended strict values" checked={true} />
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

export default ValidateMTMProductRule;
