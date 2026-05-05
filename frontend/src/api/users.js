import { useMemo } from "react";
import useSWR, { mutate } from "swr";

import axiosInstance from "./axios";
import ENDPOINTS from "./endpoints";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

// =============================
// GET ALL USERS (Admin only)
// =============================
export function useGetUsers() {
  const URL = ENDPOINTS.USERS.ALL;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      users: data || [],
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
export function useUsersGrowth(startDate) {
  const URL = startDate ? ENDPOINTS.USERS.GROWTH(startDate) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      growth: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating],
  );

  return memoizedValue;
}

export function useActivities() {
  const URL = ENDPOINTS.USERS.activity;

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
export function useMyActivities() {
  const URL = ENDPOINTS.USERS.Myactivity; // 🔥 مهم

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
export function useGetUser(id) {
  const URL = id ? ENDPOINTS.USERS.USER(id) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      user: data?.user || null,
      books: data?.books || [],
      used_codes: data?.used_codes || 0,
      classes: data?.classes || [],
      loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating],
  );

  return memoizedValue;
}
