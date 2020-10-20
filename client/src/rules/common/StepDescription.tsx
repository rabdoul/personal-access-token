import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Title } from '../../global-style';
import { useHelpUrls, withHelpTooltip } from '../../base/Help';

const StepDescription = () => {
  const { formatMessage } = useIntl();
  const activityId = useLocation().pathname.substr(1);
  const urls = useHelpUrls(`PP_ACTIVITY_${activityId}`);

  return (
    <Header>
      <Title weight="normal">{formatMessage({ id: 'step.description' })}&nbsp;</Title>
      <ActivityName helpUrl={urls[0]}>{formatMessage({ id: `activity.${activityId}` })}</ActivityName>
    </Header>
  );
};

const Header = styled.div`
  display: flex;
`;

const ActivityName = withHelpTooltip(styled.div`
  font-size: 24px;
`);

export default StepDescription;
