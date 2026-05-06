import { Box, Typography } from "@mui/material";
import ActivivtyReport from "./ActivivtyReport";
export default function Reports() {

  return (
    <Box sx={{ px: 3, py: 3 }}>
      <Typography sx={{ fontSize: 26, fontWeight: 700, mb: 3 }}>
        Reports
      </Typography>

      <ActivivtyReport />
    </Box>
  );
}
