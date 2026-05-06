import { useMemo } from "react";

import useSWR from "swr";

import axiosInstance from "./axios";
import ENDPOINTS from "./endpoints";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export function useGetTeacherActivities() {
  const URL = ENDPOINTS.TEACHER_ACTIVITIES.MY_ACTIVITIES;

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

  return memoizedValue;
}
export function useGetTeacherNotifications() {
  const URL = ENDPOINTS.TEACHER_ACTIVITIES.NOTIFICATIONS;

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
