import { Box, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ClassProgressCard() {
  const data = [
    { name: "5A", value: 72 },
    { name: "5B", value: 65 },
    { name: "6A", value: 58 },
    { name: "4A", value: 60 },
    { name: "6B", value: 45 },
    { name: "4B", value: 40 },
    { name: "3A", value: 35 },
  ];

  return (
    <Box sx={cardStyle}>
      <Box sx={header}>
        <Typography sx={title}>Class Progress Overview</Typography>
      </Box>

      <Box sx={{ width: "100%", height: 140 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3" // 👈 يخليها dashed زي الصورة
              vertical={false} // 👈 يلغي الخطوط العمودية
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#7a869a" }}
              axisLine={true}
              tickLine={true}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12, fill: "#7a869a" }}
              axisLine={true}
              tickLine={true}
            />

            <Bar
              dataKey="value"
              fill="#2B5A9E"
              radius={[6, 6, 0, 0]}
              barSize={35}
              label={{
                position: "top",
                formatter: (v) => `${v}%`,
                fontSize: 12,
                fill: "#6b7280",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

/* ===== STYLES ===== */

const cardStyle = {
  background: "#fff",
  borderRadius: "14px",
  p: 2,
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

const title = {
  fontWeight: 600,
};
