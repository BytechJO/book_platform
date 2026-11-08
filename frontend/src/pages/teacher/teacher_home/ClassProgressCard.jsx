import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { useDashboardLanguage } from "../../../contexts/dashboardLanguage";

export default function ClassProgressCard() {
  const theme = useTheme();
  const { t } = useDashboardLanguage();
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
        <Typography sx={title}>{t("Class Progress Overview")}</Typography>
      </Box>

      <Box
        dir="ltr"
        sx={{
          width: "100%",
          height: 140,
          direction: "ltr",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill: theme.palette.text.secondary,
              }}
              axisLine
              tickLine
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{
                fontSize: 12,
                fill: theme.palette.text.secondary,
              }}
              width={45}
              axisLine
              tickLine
            />

            <Bar
              dataKey="value"
              fill={theme.palette.primary.main}
              radius={[6, 6, 0, 0]}
              barSize={35}
              label={{
                position: "top",
                formatter: (v) => `${v}%`,
                fontSize: 12,
                fill: theme.palette.text.secondary,
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
  bgcolor: "background.paper",
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
