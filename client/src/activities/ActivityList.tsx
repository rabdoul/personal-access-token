import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Activity } from '../model';
import ActivityItem from './ActivityItem';
import Title from '../common/Title';
import { useAccessToken } from '../base/Authentication';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

const ActivityList = () => {
  const accessToken = useAccessToken();
  const { formatMessage } = useIntl();

  const { data: activities } = useQuery<Activity[]>('activities', () => {
    return fetchData(accessToken, 'activities').then((activities: Activity[]) => activities.sort((a1, a2) => a1.order - a2.order));
  });

  return (
    <List>
      <Title>{formatMessage({ id: 'process' })}</Title>
      <ItemsContainer>
        {activities?.map((activity, index) => (
          <ActivityItem key={activity.id} activity={activity} first={index === 0} last={index === activities.length - 1} />
        ))}
      </ItemsContainer>
    </List>
  );
};

const List = styled.div`
  border-right: 1px solid #ccc;
  box-shadow: rgba(0, 0, 0, 0.2) 1px 0 3px;
  height: calc(100% - 95px);
  padding: 20px;
  width: 380px;
`;

const ItemsContainer = styled.div`
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  max-height: calc(100% - 55px);
  overflow: auto;
`;

export default ActivityList;
