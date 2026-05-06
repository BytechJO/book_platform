import { useMemo } from "react";
import useSWR, { mutate } from "swr";

import axiosInstance from "./axios";
import ENDPOINTS from "./endpoints";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

// =============================

export function useGetTeacherClasses() {
  const URL = ENDPOINTS.Classes.TeacherClasses;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      classes: data || [],
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

export function useGetClassesByBook(bookId) {
  const URL = bookId ? ENDPOINTS.Classes.MyClassesByBook(bookId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      classes: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating],
  );

  const refetch = async () => {
    if (URL) await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}
export function useGetStudentClasses() {
  const URL = ENDPOINTS.Classes.StudentClasses;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      classes: data || [],
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
