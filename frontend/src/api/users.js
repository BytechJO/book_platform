import { useMemo } from "react";
import useSWR, { mutate } from "swr";

import axiosInstance from "./axios";
import ENDPOINTS from "./endpoints";

const fetcher = (url) =>
  axiosInstance.get(url).then((res) => res.data);

// =============================
// GET ALL USERS (Admin only)
// =============================
export function useGetUsers() {
  const URL = ENDPOINTS.USERS.ALL;

  const { data, isLoading, error, isValidating } =
    useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      users: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  const refetch = async () => {
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}