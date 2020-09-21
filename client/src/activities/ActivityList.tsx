import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Activity } from '../model';
import ActivityItem from './ActivityItem';

interface Props {
  activities: Activity[];
}

const ActivityList: React.FC<Props> = ({ activities }) => {
  const { formatMessage } = useIntl();
  return (
    <List>
      <Title>{formatMessage({ id: 'process' })}</Title>
      <ItemsContainer>
        {activities.map((activity, index) => (
          <ActivityItem key={activity.reference} activity={activity} first={index === 0} last={index === activities.length - 1} />
        ))}
      </ItemsContainer>
    </List>
  );
};

export default ActivityList;

const List = styled.div`
  border-right: 1px solid #ccc;
  box-shadow: rgba(0, 0, 0, 0.2) 1px 0 3px;
  height: calc(100% - 95px);
  padding: 20px;
  width: 380px;
`;

const Title = styled.div`
  color: #16a085;
  font-size: 24px;
  font-weight: lighter;
  margin-bottom: 20px;
`;

const ItemsContainer = styled.div`
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  max-height: calc(100% - 55px);
  overflow: auto;
`;
