import { Box, Typography, Grid, Paper, Avatar, Divider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import DescriptionIcon from "@mui/icons-material/Description";
import { LineChart } from "@mui/x-charts/LineChart";

import WelcomeBanner from "./WelcomeBanner";
const margin = { right: 24 };

const data = [24, 10, 35, 15, 34, 18, 36, 11, 24];

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export default function Dashboard() {
  const documents = [
    {
      title: "Class A 1st semester result",
      date: "04 May, 09:20AM",
    },
    {
      title: "Arabic college application",
      date: "01 Aug, 04:20PM",
    },
    {
      title: "Class E attendance sheet",
      date: "01 Oct, 08:20AM",
    },
  ];

  const staff = [
    {
      name: "Mohammed saleh",
      msg: "Hello, Mr Tarek i am yet to get your class b res...",
      time: "10:25 am",
      initials: "MS",
    },
    {
      name: "Samer Othman",
      msg: "Please schedule your class test.",
      time: "12:35 pm",
      initials: "SO",
    },
    {
      name: "Saif Mahmoud",
      msg: "Please resend last session statistic",
      time: "04:30 pm",
      initials: "SM",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <WelcomeBanner />

      <Box
        sx={{
          p: {
            xs: 2,
            md: 3,
          },
          m: {
            xs: 1,
            md: 5,
          },
          mr: {
            xs: 0, // 👈 شيل اليمين على الموبايل
            md: 5, // 👈 خليه طبيعي على الديسكتوب
          },
        }}
      >
        {/* ===== TOP SECTION ===== */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column", // موبايل
              md: "row", // ديسكتوب
            },
            gap: 3,
            width: "100%",
          }}
        >
          {/* Documents */}
          <Box sx={{ flex: 1, marginRight: 2 }}>
            <Header title="Documents" />

            {documents.map((doc, i) => (
              <Row key={i} last={i === documents.length - 1}>
                <IconBox>
                  <DescriptionIcon sx={{ color: "#1A73E8" }} />
                </IconBox>

                <Box>
                  <Typography fontSize={14} fontWeight={500}>
                    {doc.title}
                  </Typography>
                  <Typography fontSize={12} color="#9e9e9e">
                    {doc.date}
                  </Typography>
                </Box>
              </Row>
            ))}
          </Box>
          {/* Staff */}
          <Box sx={{ flex: 1 }}>
            <Header title="Staff Room" />

            {staff.map((s, i) => (
              <Row key={i} last={i === staff.length - 1}>
                <Avatar sx={avatarStyle}>{s.initials}</Avatar>

                <Box flex={1} ml={2}>
                  <Typography fontSize={14} fontWeight={500}>
                    {s.name}
                  </Typography>
                  <Typography fontSize={12} color="#9e9e9e" noWrap>
                    {s.msg}
                  </Typography>
                </Box>

                <Typography fontSize={11} color="gray">
                  {s.time}
                </Typography>
              </Row>
            ))}
          </Box>

          {/* Calendar */}
          <Box sx={{ width: 400 }}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                height: 350,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  defaultValue={dayjs()}
                  sx={{
                    width: "100%",
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "#1A73E8",
                      color: "#fff",
                    },
                  }}
                />
              </LocalizationProvider>
            </Paper>
          </Box>
        </Box>
        {/* ===== الرسم البياني تحت كل شي ===== */}
        <Box
          mt={3}
          sx={{
            width: {
              xs: "100%", // موبايل
              md: "60%", // ديسكتوب
            },
          }}
        >
          <Paper sx={cardStyle}>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={600}>Student Active</Typography>
              <Typography color="gray">Year 2025</Typography>
            </Box>

            <Box mt={2}>
              <StudentChart />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

/* ===== Components ===== */

const Header = ({ title }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography fontWeight={600}>{title}</Typography>
    <Typography
      color="#1A73E8"
      fontSize={14}
      sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
    >
      See all
    </Typography>
  </Box>
);

const Row = ({ children, last }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      py: 2,
      borderBottom: last ? "none" : "1px solid #e5e7eb",
    }}
  >
    {children}
  </Box>
);

const IconBox = ({ children }) => (
  <Box
    sx={{
      width: 40,
      height: 40,
      background: "#E8F0FE",
      borderRadius: 2,
      mr: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {children}
  </Box>
);

/* ===== Styles ===== */

const cardStyle = {
  p: 2,
  borderRadius: 3,
  boxShadow: "none",
  background: "transparent",
};
const avatarStyle = {
  bgcolor: "#E8F0FE",
  color: "#1A73E8",
  mr: 2,
  fontSize: 14,
  width: 36,
  height: 36,
};
function CustomMark(props) {
  const { x, y, color } = props;

  return (
    <g>
      <circle cx={x} cy={y} r={4} fill={color || "#FFC107"} />
      <text
        x={x}
        y={Number(y) - 10}
        style={{
          textAnchor: "middle",
          fill: color || "#FFC107",
          fontWeight: "bold",
          fontSize: 10,
        }}
      >
        {data[props.dataIndex]}
      </text>
    </g>
  );
}

const StudentChart = () => {
  return (
    <Box sx={{ width: "100%", height: 200 }}>
      <LineChart
        series={[
          {
            data: data,
            color: "#FFC107",
          },
        ]}
        xAxis={[{ scaleType: "point", data: labels }]}
        yAxis={[{ width: 40 }]}
        margin={margin}
        slots={{
          mark: CustomMark,
        }}
      />
    </Box>
  );
};
