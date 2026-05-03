import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { useBooksGrowth } from "../../../api";

export default function BooksChart({ startDate }) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const formattedDate = start.toISOString();
  const { growth, loading } = useBooksGrowth(formattedDate);
  const generateWeeks = (startDate) => {
    if (!startDate) return [];

    const dates = [];

    for (let i = 0; i < 5; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i * 7);

      dates.push({
        name: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      });
    }

    return dates;
  };

  const weeks = generateWeeks(startDate);

  const chartData = weeks.map((week, index) => ({
    ...week,
    value: growth?.[index]?.value || 0,
  }));

  if (loading) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "12px",
        p: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        height: 300,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontWeight: 600, color: "#1F4E8C" }}>
          Books Published{" "}
        </Typography>

        <Box
          sx={{
            fontSize: 12,
            background: "#f5f5f5",
            px: 1.5,
            py: 0.5,
            borderRadius: "6px",
          }}
        >
          Last 30 days
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis width={25} />
          <Tooltip />

          <Bar
            dataKey="value"
            fill="#4A79C9"
            radius={[6, 6, 0, 0]}
            barSize={35}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
