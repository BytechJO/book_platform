import { useMemo } from "react";
import useSWR, { mutate } from "swr";

import axiosInstance from "./axios";
import ENDPOINTS from "./endpoints";

const fetcher = (url) =>
  axiosInstance.get(url).then((res) => res.data);


// GET ALL BOOKS
export function useGetBooks() {
  const URL = ENDPOINTS.BOOKS.ALL;

  const { data, isLoading, error, isValidating } =
    useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      books: data || [],
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


// GET BOOK BY ID
export function useGetBook(id) {
  const URL = id ? ENDPOINTS.BOOKS.BY_ID(id) : null;

  const { data, isLoading, error } =
    useSWR(URL, fetcher);

  return {
    book: data || null,
    loading: isLoading,
    error,
  };
}