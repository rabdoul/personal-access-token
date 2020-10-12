import { fetchData } from 'raspberry-fetch';
import { useQuery } from 'react-query';
import { useAccessToken } from '../base/Authentication';
import { ActivityConfiguration } from '../model';

import { ActivityId } from '../UIState';

export default function useActivityConfiguration(activityId: ActivityId): ActivityConfiguration | undefined {
  const accessToken = useAccessToken();
  const { data: configuration } = useQuery(['activities', activityId], () => fetchData(accessToken, `activities/${activityId}`));
  return configuration;
}
