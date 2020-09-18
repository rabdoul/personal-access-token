import React from 'react';
import styled from 'styled-components';

import { Activity } from '../model';
import ActivityItem from './ActivityItem';

const ActivityList = (props: { activities: Activity[] }) => {
  return (
    <List>
      <Title>Process</Title>
      <ItemsContainer>
        {props.activities.map(activity => (
          <ActivityItem activity={activity} />
        ))}
      </ItemsContainer>
    </List>
  );
};

export default ActivityList;

const List = styled.div`
  border-right: 1px solid #ccc;
  box-shadow: rgba(0, 0, 0, 0.2) 1px 0 3px;
  height: calc(100% - 100px);
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
