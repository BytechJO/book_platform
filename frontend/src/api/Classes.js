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

export function useGetTeacherClassDetails(classId) {
  const URL = classId ? ENDPOINTS.Classes.TeacherClassDetails(classId) : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return {
    details: data || null,
    loading: isLoading,
    error,
    validating: isValidating,
    refetch: () => (URL ? mutate(URL) : Promise.resolve()),
  };
}

export function useGetStudentClassDetails(classId) {
  const URL = classId ? ENDPOINTS.Classes.StudentClassDetails(classId) : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return {
    details: data || null,
    loading: isLoading,
    error,
    validating: isValidating,
    refetch: () => (URL ? mutate(URL) : Promise.resolve()),
  };
}

export async function createClassNote(classId, values) {
  await axiosInstance.post(ENDPOINTS.Classes.ClassNotes(classId), values);
  await mutate(ENDPOINTS.Classes.TeacherClassDetails(classId));
}

export async function updateClassNote(classId, noteId, values) {
  await axiosInstance.put(ENDPOINTS.Classes.ClassNote(classId, noteId), values);
  await mutate(ENDPOINTS.Classes.TeacherClassDetails(classId));
}

export async function deleteClassNote(classId, noteId) {
  await axiosInstance.delete(ENDPOINTS.Classes.ClassNote(classId, noteId));
  await mutate(ENDPOINTS.Classes.TeacherClassDetails(classId));
}

export async function setClassItemPinned(classId, itemId, isPinned) {
  await axiosInstance.patch(ENDPOINTS.Classes.ClassItemPin(classId, itemId), {
    is_pinned: isPinned,
  });
  await mutate(ENDPOINTS.Classes.TeacherClassDetails(classId));
  await mutate(ENDPOINTS.Classes.StudentClassDetails(classId));
}

const buildResourceFormData = (values) => {
  const formData = new FormData();
  formData.append("resource_type", values.resource_type);
  formData.append("title", values.title);
  formData.append("description", values.description || "");
  formData.append("resource_url", values.resource_url || "");
  if (values.file) formData.append("file", values.file);
  return formData;
};

export async function createClassResource(classId, values) {
  await axiosInstance.post(
    ENDPOINTS.Classes.ClassResources(classId),
    buildResourceFormData(values),
  );
  await mutate(ENDPOINTS.Classes.TeacherClassDetails(classId));
}

export async function updateClassResource(classId, resourceId, values) {
  await axiosInstance.put(
    ENDPOINTS.Classes.ClassResource(classId, resourceId),
    buildResourceFormData(values),
  );
  await mutate(ENDPOINTS.Classes.TeacherClassDetails(classId));
}

export async function deleteClassResource(classId, resourceId) {
  await axiosInstance.delete(
    ENDPOINTS.Classes.ClassResource(classId, resourceId),
  );
  await mutate(ENDPOINTS.Classes.TeacherClassDetails(classId));
}

export async function downloadClassResource(resource) {
  const response = await axiosInstance.get(
    ENDPOINTS.Classes.ClassResourceDownload(resource.id),
    { responseType: "blob" },
  );

  const objectUrl = window.URL.createObjectURL(response.data);
  const downloadLink = document.createElement("a");
  downloadLink.href = objectUrl;
  downloadLink.download =
    resource.original_file_name || `resource-${resource.id}`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
}
