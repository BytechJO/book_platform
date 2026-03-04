import { useMemo } from "react";
import useSWR, { mutate } from "swr";

import axiosInstance from "./axios";
import ENDPOINTS from "./endpoints";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);
export function useGetMyBooks() {
  const URL = ENDPOINTS.User_book.my_books;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      books: data || [],
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
export function useGetMyOneBook(bookId) {
  const URL = ENDPOINTS.User_book.my_books_one(bookId);
  const { data, isLoading, error, isValidating } = useSWR(
    bookId ? URL : null,
    fetcher,
  );

  const memoizedValue = useMemo(
    () => ({
      book: data || [],
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
