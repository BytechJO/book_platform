const sanitizeFileNamePart = (value) =>
  String(value || "")
    .trim()
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "");

const getLocalDateStamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function buildFilteredExportFileName(prefix, filters = {}) {
  const currentYear = String(new Date().getFullYear());
  const filterParts = Object.entries(filters)
    .filter(
      ([label, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !(label === "year" && String(value) === currentYear),
    )
    .map(([, value]) => value)
    .map(sanitizeFileNamePart)
    .filter(Boolean);
  const descriptiveName = [sanitizeFileNamePart(prefix), ...filterParts]
    .filter(Boolean)
    .join("-");

  return `${descriptiveName}_${getLocalDateStamp()}.xlsx`;
}
