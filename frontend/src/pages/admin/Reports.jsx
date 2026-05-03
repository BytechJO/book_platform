import { Box, Typography } from "@mui/material";
import { useGetCodes, useGetBooks } from "src/api";
import { useState } from "react";
import CurveLoader from "../../components/CurveLoader";

export default function Reports() {
  const { codes = [], loading } = useGetCodes();
  const { books = [] } = useGetBooks();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  if (loading) return <CurveLoader />;

  // فلترة
  const filtered = codes.filter((c) => {
    const matchesSearch =
      !search || c.code.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "all" ? true : status === "used" ? c.is_used : !c.is_used;

    return matchesSearch && matchesStatus;
  });

  // stats
  const total = filtered.length;
  const used = filtered.filter((c) => c.is_used).length;
  const unused = total - used;

  return (
    <Box sx={{ px: 3, py: 3 }}>
      <Typography sx={{ fontSize: 26, fontWeight: 700, mb: 3 }}>
        Reports
      </Typography>

      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard title="Total Codes" value={total} />
        <StatCard title="Used Codes" value={used} />
        <StatCard title="Unused Codes" value={unused} />
        <StatCard title="Books" value={books.length} />
      </Box>

      {/* Table */}
      <Box sx={{ background: "#fff", p: 2, borderRadius: 2 }}>
        <Typography sx={{ mb: 2 }}>Filtered Codes</Typography>

        {filtered.slice(0, 10).map((c) => (
          <Box key={c.id} sx={{ py: 1 }}>
            {c.code}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
function StatCard({ title, value }) {
  return (
    <Box
      sx={{
        background: "#fff",
        p: 2,
        borderRadius: 2,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <Typography sx={{ fontSize: 12, color: "#777" }}>{title}</Typography>
      <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}
