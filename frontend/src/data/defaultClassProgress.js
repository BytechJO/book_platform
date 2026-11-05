// Temporary values until book progress is stored in the database.
// Change or extend this one array whenever you need different demo values.
export const DEFAULT_CLASS_PROGRESS = [72, 65, 80, 60, 90];

export function getStudentProgress(student, index = 0) {
  const realProgress = Number(student?.progress_percentage);
  if (
    student?.progress_percentage !== null &&
    student?.progress_percentage !== undefined &&
    Number.isFinite(realProgress)
  ) {
    return Math.min(100, Math.max(0, realProgress));
  }

  const studentId = Number(student?.id);
  const fallbackIndex =
    Number.isFinite(studentId) && studentId > 0
      ? (studentId - 1) % DEFAULT_CLASS_PROGRESS.length
      : index % DEFAULT_CLASS_PROGRESS.length;

  return DEFAULT_CLASS_PROGRESS[fallbackIndex];
}
