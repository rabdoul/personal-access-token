import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';
import Ribbon from '@lectra/embed-ribbon';
import { Switch, Route } from 'react-router-dom';

import { Activity } from './model';
import ActivityList from './activities/ActivityList';
import { useAccessToken } from './base/Authentication';
import Rule from './Rule';

const ProductionProcessScreen = () => {
  const accessToken = useAccessToken();

  const { data: activities } = useQuery<Activity[]>('activities', () => {
    return fetchData(accessToken, 'activities').then((activities: Activity[]) => activities.sort((a1, a2) => a1.order - a2.order));
  });

  return (
    <Screen>
      <Ribbon config={{ id: '', groups: [] }} />
      <Content>
        <ActivityList activities={activities ?? []}></ActivityList>
        <Switch>
          <Route path="/:activityId" component={Rule} />
        </Switch>
      </Content>
    </Screen>
  );
};

const Screen = styled.div`
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  height: 100%;
`;

export default ProductionProcessScreen;
