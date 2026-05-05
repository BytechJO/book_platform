import { Box, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { useState } from "react";
import dayjs from "dayjs";
import { useGetTeacherEvents } from "../../../api/events";
import { useNavigate } from "react-router-dom";

export default function UpcomingScheduleCard() {
  const { events } = useGetTeacherEvents();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const navigate = useNavigate();
  // 📌 events لليوم المختار
  const selectedEvents = events.filter(
    (e) =>
      dayjs(e.date).format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD"),
  );

  return (
    <Box sx={cardStyle}>
      <Typography sx={titleStyle}>Upcoming Schedule</Typography>

      {/* Calendar */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          sx={{
            width: "100%",
            mt: -1,

            // ===== HEADER =====
            "& .MuiPickersCalendarHeader-root": {
              position: "relative",
              display: "flex",
              alignItems: "center",
            },

            "& .MuiPickersCalendarHeader-labelContainer": {
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            },

            "& .MuiPickersArrowSwitcher-root": {
              marginLeft: "auto",
            },

            // ===== DAYS =====
            "& .MuiDayCalendar-header": {
              justifyContent: "space-around",
            },

            "& .MuiDayCalendar-weekContainer": {
              justifyContent: "space-around",
            },

            "& .MuiPickersDay-root": {
              width: 30,
              height: 30,
              fontSize: "0.75rem",
            },

            "& .MuiDayCalendar-root": {
              marginBottom: 0,
            },
          }}
          slots={{
            day: (props) => {
              const { day, outsideCurrentMonth, ...other } = props;

              const eventForDay = events.find(
                (e) =>
                  dayjs(e.date).format("YYYY-MM-DD") ===
                  day.format("YYYY-MM-DD"),
              );

              const isEventDay = !!eventForDay;

              const isPast = eventForDay
                ? dayjs(eventForDay.date).isBefore(dayjs(), "day")
                : false;

              return (
                <Box sx={{ position: "relative" }}>
                  <PickersDay
                    {...other}
                    day={day}
                    outsideCurrentMonth={outsideCurrentMonth}
                  />

                  {isEventDay && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: isPast ? "#9e9e9e" : "#1976d2",
                        position: "absolute",
                        bottom: 4,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    />
                  )}
                </Box>
              );
            },
          }}
        />
      </LocalizationProvider>

      {/* Events List */}
      <Box
        sx={{
          mt: selectedEvents.length === 0 ? -2 : 1,
        }}
      >
        {selectedEvents.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            {/* LEFT */}
            <Typography sx={{ fontSize: 12, color: "#9aa5b1" }}>
              No events for this day
            </Typography>

            {/* RIGHT */}
            <Typography
              onClick={() =>
                navigate("/teacher/events/create", {
                  state: { selectedDate: selectedDate.toISOString() },
                })
              }
              sx={{
                fontSize: 12,
                color: "#3f51b5",
                cursor: "pointer",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Add Event ➕
            </Typography>
          </Box>
        ) : (
          selectedEvents.map((event, i) => {
            const isPast = dayjs(event.date).isBefore(dayjs(), "day");

            return (
              <Box key={i} sx={eventBox}>
                {/* LEFT: TIME */}
                <Box sx={timeBox}>
                  {dayjs(event.time, "HH:mm:ss").format("hh:mm A")}
                </Box>

                {/* CENTER: TEXT */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                    {event.title}
                  </Typography>

                  <Typography sx={{ fontSize: 12, color: "#7a869a" }}>
                    {event.subject}
                  </Typography>
                </Box>

                {/* RIGHT: BADGE */}
                <Box
                  sx={{
                    ...badge,
                    backgroundColor: isPast ? "#eeeeee" : "#e3f2fd",
                    color: isPast ? "#757575" : "#1976d2",
                  }}
                >
                  {isPast ? "Finished" : "Upcoming"}
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}

const cardStyle = {
  background: "#fff",
  borderRadius: "14px",
  p: 1.5,
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  height: 400,
  display: "flex",
  flexDirection: "column",
};
const titleStyle = {
  fontWeight: 600,
  mb: 1,
};
const eventBox = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  p: 1,
  borderRadius: "10px",
  background: "#f5f7fb",
};

const timeBox = {
  fontSize: 11,
  fontWeight: 600,
  px: 1,
  py: 0.3,
  borderRadius: "8px",
  backgroundColor: "#eef2ff",
  color: "#3f51b5",
  minWidth: 60,
  textAlign: "center",
};

const badge = {
  fontSize: 10,
  px: 1,
  py: 0.2,
  borderRadius: "6px",
  backgroundColor: "#e3f2fd",
  color: "#1976d2",
  fontWeight: 600,
};
