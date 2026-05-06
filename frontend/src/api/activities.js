import { useMemo } from "react";
import useSWR, { mutate } from "swr";

import axiosInstance from "./axios";
import ENDPOINTS from "./endpoints";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export function useGetActivities() {
  const URL = ENDPOINTS.ACTIVITIES.ALL;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      activities: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating],
  );

  const refetch = async () => {
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}
export const markAllActivitiesAsRead = async () => {
  await axiosInstance.post(ENDPOINTS.ACTIVITIES.READ_ALL);

  mutate(ENDPOINTS.ACTIVITIES.ALL);
};
export function useGetNotifications() {
  const URL = ENDPOINTS.ACTIVITIES.NOTIFICATIONS;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      notifications: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating],
  );

  return memoizedValue;
}
