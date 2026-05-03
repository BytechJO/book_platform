import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { useUsersGrowth } from "../../../api";

export default function UsersGrowthChart({ startDate }) {
  // 🔹 تحويل التاريخ
  const formattedDate = startDate
    ? startDate.toISOString().split("T")[0]
    : null;

  // 🔹 جلب البيانات من API
  const { growth, loading } = useUsersGrowth(formattedDate);

  // 🔹 توليد 5 أسابيع من startDate
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

  // 🔹 تجهيز البيانات للمخطط
  const weeks = generateWeeks(startDate);

  const chartData = weeks.map((week, index) => ({
    ...week,
    value: growth?.[index]?.value || 0,
  }));

  // 🔹 حالات خاصة
  if (!startDate) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Select start date</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

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
      {/* العنوان */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontWeight: 600, color: "#1F4E8C" }}>
          Users Growth
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

      {/* الرسم */}
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A79C9" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#4A79C9" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis width={25} />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#4A79C9"
            fill="url(#color)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
