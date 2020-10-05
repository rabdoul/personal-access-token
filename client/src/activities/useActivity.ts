import { fetchData } from 'raspberry-fetch';
import { useQuery } from 'react-query';
import { useAccessToken } from '../base/Authentication';

export default function useActivity(activityId: string) {
  const accessToken = useAccessToken();
  return useQuery(['activities', activityId], () => fetchData(accessToken, `activities/${activityId}`));
}
