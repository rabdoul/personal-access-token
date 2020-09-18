import React from 'react';
import { useQuery } from 'react-query';
import Ribbon from '@lectra/embed-ribbon';
import { fetchData } from 'raspberry-fetch';

import { Activity } from './model';
import ActivityList from './activity-list/ActivityList';
import { useAccessToken } from './base/Authentication';
import styled from 'styled-components';

const ProductionProcessScreen = () => {
  const accessToken = useAccessToken();

  const { data: activities } = useQuery<Activity[]>('activities', async () => {
    return await fetchData(accessToken, 'activities').then((activities: Activity[]) => activities.sort((a1, a2) => a1.order - a2.order));
  });

  return (
    <Container>
      <Ribbon config={{ id: '', groups: [] }} />
      <ActivityList activities={activities ?? []}></ActivityList>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
`;

export default ProductionProcessScreen;
