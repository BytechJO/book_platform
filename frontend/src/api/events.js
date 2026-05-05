import { useMemo } from "react";
import useSWR, { mutate } from "swr";

import axiosInstance from "./axios";
import ENDPOINTS from "./endpoints";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

// =============================
// GET MY EVENTS (Teacher)
// =============================
export function useGetTeacherEvents() {
  const URL = ENDPOINTS.EVENTS.MY_EVENTS;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      events: data || [],
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