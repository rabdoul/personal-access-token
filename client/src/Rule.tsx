import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import Title from './common/Title';

const Rule = () => {
  const { formatMessage } = useIntl();
  const activityId = useParams<{ activityId: string }>().activityId;

  return (
    <Container>
      <Header>
        <Title weight="normal">{formatMessage({ id: 'step.description' })}&nbsp;</Title>
        <ActivityName>{formatMessage({ id: `activity.${activityId}` })}</ActivityName>
      </Header>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100% - 95px);
  padding: 20px;
  width: calc(100% - 380px);
`;

const Header = styled.div`
  display: flex;
`;

const ActivityName = styled.div`
  font-size: 24px;
`;

export default Rule;
