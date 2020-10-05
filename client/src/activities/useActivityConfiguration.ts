import { fetchData } from 'raspberry-fetch';
import { QueryResult, useQuery } from 'react-query';
import { useAccessToken } from '../base/Authentication';
import { ActivityConfiguration } from '../model';

import { ActivityId } from '../UIState';

export default function useActivityConfiguration(activityId: ActivityId): QueryResult<ActivityConfiguration> {
  const accessToken = useAccessToken();
  return useQuery(['activities', activityId], () => fetchData(accessToken, `activities/${activityId}`));
}
