import { useMemo } from "react";
import useSWR, { mutate } from "swr";

import axiosInstance from "./axios";
import ENDPOINTS from "./endpoints";

const fetcher = (url) =>
  axiosInstance.get(url).then((res) => res.data);
// =============================
// GET ALL CODES (Admin only)
// =============================
export function useGetCodes() {
  const URL = ENDPOINTS.CodeS.ALL;
    const { data, isLoading, error, isValidating } =    
    useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      codes: data || [],
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