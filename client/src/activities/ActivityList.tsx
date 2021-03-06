import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

import { Activity } from '../model';
import ActivityItem from './ActivityItem';
import { useAccessToken } from '../base/Authentication';
import { ActivityId, useUIState } from '../UIState';
import { Title } from '../global-style';

const ActivityList = () => {
  const accessToken = useAccessToken();
  const { formatMessage } = useIntl();
  const { editedRules, invalidRules } = useUIState();
  const { data: activities } = useQuery<Activity[]>('activities', () =>
    fetchData(accessToken, 'activities').then((activities: Activity[]) => activities.sort((a1, a2) => a1.order - a2.order))
  );

  return (
    <List>
      <Title>{formatMessage({ id: 'process' })}</Title>
      <ListContainer>
        <ItemsContainer>
          {activities?.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              first={index === 0}
              last={index === activities.length - 1}
              edited={editedRules.has(activity.id as ActivityId)}
              invalid={(invalidRules && invalidRules.has(activity.id as ActivityId)) || false}
            />
          ))}
        </ItemsContainer>
      </ListContainer>
    </List>
  );
};

const List = styled.div`
  border-right: 1px solid #ccc;
  box-shadow: rgba(0, 0, 0, 0.2) 1px 0 3px;
  height: 100%;
  padding: 20px;
  width: 380px;
`;

const ListContainer = styled.div`
  max-height: calc(100% - 55px);
  overflow: auto;
`;

const ItemsContainer = styled.div`
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  margin-right: 5px;
`;

export default ActivityList;
