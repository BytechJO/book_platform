import { useMemo, useState } from "react";

import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@mui/material";

import PreviewIcon from "@mui/icons-material/Preview";
import DownloadIcon from "@mui/icons-material/Download";

import html2pdf from "html2pdf.js";

import { useGetActivities } from "../../../../api/activities";

export default function ActivivtyReport() {
  const { activities = [] } = useGetActivities();

  const [visible, setVisible] = useState(10);

  const [open, setOpen] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [type, setType] = useState("all");

  // FILTER
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const activityDate =
        activity.created_at.split("T")[0];

      const matchesFrom = fromDate
        ? activityDate >= fromDate
        : true;

      const matchesTo = toDate
        ? activityDate <= toDate
        : true;

      const matchesType =
        type === "all"
          ? true
          : activity.type === type;

      return (
        matchesFrom &&
        matchesTo &&
        matchesType
      );
    });
  }, [
    activities,
    fromDate,
    toDate,
    type,
  ]);

  // DOWNLOAD PDF
  const handleDownloadPDF = () => {
    const element =
      document.getElementById("pdf-content");

    const options = {
      margin: 0.5,
      filename: "activity-report.pdf",

      image: {
        type: "jpeg",
        quality: 1,
      },

      html2canvas: {
        scale: 2,
      },

      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save();
  };

  return (
    <>
      {/* MAIN REPORT */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: 3,
          p: 3,
          mb: 3,
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* HEADER */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Activity Report
          </Typography>

          <Button
            variant="contained"
            startIcon={<PreviewIcon />}
            onClick={() => setOpen(true)}
          >
            Preview PDF
          </Button>
        </Stack>

        {/* ACTIVITIES GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 1.5,
          }}
        >
          {filteredActivities
            .slice(0, visible)
            .map((activity) => (
              <Box
                key={activity.id}
                sx={{
                  border:
                    "1px solid #eee",
                  borderRadius: 2,
                  p: 1.5,
                  minHeight: 100,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    mb: 1,
                  }}
                >
                  {activity.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#666",
                    mb: 1,
                  }}
                >
                  {activity.description}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#999",
                  }}
                >
                  {new Date(
                    activity.created_at
                  ).toLocaleString()}
                </Typography>
              </Box>
            ))}
        </Box>

        {/* READ MORE */}
        {visible <
          filteredActivities.length && (
          <Box
            sx={{
              textAlign: "center",
              mt: 3,
            }}
          >
            <Button
              onClick={() =>
                setVisible(
                  (prev) =>
                    prev + 10
                )
              }
            >
              Read More
            </Button>
          </Box>
        )}
      </Box>

      {/* PREVIEW DIALOG */}
      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          PDF Preview
        </DialogTitle>

        <DialogContent>
          {/* FILTERS */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mb: 3,
              mt: 1,
              flexWrap: "wrap",
            }}
          >
            {/* TYPE */}
            <Select
              size="small"
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value
                )
              }
            >
              <MenuItem value="all">
                All
              </MenuItem>

              <MenuItem value="book">
                Books
              </MenuItem>

              <MenuItem value="event">
                Events
              </MenuItem>

              <MenuItem value="class">
                Classes
              </MenuItem>

              <MenuItem value="code">
                Codes
              </MenuItem>

              <MenuItem value="user">
                Users
              </MenuItem>
            </Select>

            {/* FROM DATE */}
            <TextField
              type="date"
              label="From"
              InputLabelProps={{
                shrink: true,
              }}
              value={fromDate}
              onChange={(e) =>
                setFromDate(
                  e.target.value
                )
              }
            />

            {/* TO DATE */}
            <TextField
              type="date"
              label="To"
              InputLabelProps={{
                shrink: true,
              }}
              value={toDate}
              onChange={(e) =>
                setToDate(
                  e.target.value
                )
              }
            />

            {/* DOWNLOAD */}
            <Button
              variant="contained"
              startIcon={
                <DownloadIcon />
              }
              onClick={
                handleDownloadPDF
              }
            >
              Download PDF
            </Button>
          </Stack>

          {/* PDF CONTENT */}
          <Box
            id="pdf-content"
            sx={{
              p: 2,
              background: "#fff",
            }}
          >
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 700,
                mb: 3,
              }}
            >
              Activity Report
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Title
                  </TableCell>

                  <TableCell>
                    Description
                  </TableCell>

                  <TableCell>
                    Type
                  </TableCell>

                  <TableCell>
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredActivities.map(
                  (activity) => (
                    <TableRow
                      key={
                        activity.id
                      }
                    >
                      <TableCell>
                        {
                          activity.title
                        }
                      </TableCell>

                      <TableCell>
                        {
                          activity.description
                        }
                      </TableCell>

                      <TableCell>
                        {
                          activity.type
                        }
                      </TableCell>

                      <TableCell>
                        {new Date(
                          activity.created_at
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}