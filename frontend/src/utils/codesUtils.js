export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function roleLabel(role) {
  if (!role) return "—";
  const r = role.toLowerCase();
  if (r === "student") return "Student";
  if (r === "teacher") return "Teacher";
  if (r === "admin") return "Admin";
  return role;
}

export function countActiveFilters({ search, bookId, status, role, year }) {
  let count = 0;

  const currentYear = new Date().getFullYear().toString();

  if (search.trim()) count++;
  if (bookId !== "all") count++;
  if (status !== "all") count++;
  if (role !== "all") count++;
  if (year === "all" || year !== currentYear) count++;

  return count;
}
