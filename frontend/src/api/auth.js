import { useMemo } from "react";
import useSWR, { mutate } from "swr";

import axiosInstance from "./axios";
import ENDPOINTS from "./endpoints";

const fetcher = (url) => axiosInstance.get(url).then(res => res.data);

export function useAuthMe() {
  const URL = ENDPOINTS.AUTH.ME;

  const { data, isLoading, error, isValidating } = useSWR(
    URL,
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      user: data || null,
      loading: isLoading,
      error,
      validating: isValidating,
      isAuthenticated: !!data,
    }),
    [data, error, isLoading, isValidating]
  );

  const refetch = async () => {
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}