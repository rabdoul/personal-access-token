import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Title from './Title';

const StepDescription = () => {
  const { formatMessage } = useIntl();
  const activityId = useLocation().pathname.substr(1);
  return (
    <Header>
      <Title weight="normal">{formatMessage({ id: 'step.description' })}&nbsp;</Title>
      <ActivityName>{formatMessage({ id: `activity.${activityId}` })}</ActivityName>
    </Header>
  );
};

const Header = styled.div`
  display: flex;
`;

const ActivityName = styled.div`
  font-size: 24px;
`;

export default StepDescription;
