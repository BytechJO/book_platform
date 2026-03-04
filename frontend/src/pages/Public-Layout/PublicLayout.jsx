import PublicTopBar from "../../components/layout/PublicTopBar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function PublicLayout() {
  return (
    <>
      <PublicTopBar />
      <Box sx={{ mt: "50px" }}>
        <Outlet />
      </Box>
    </>
  );
}
