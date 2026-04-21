import PublicTopBar2 from "../../components/layout/HomeBar2";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function PublicLayout() {
  return (
    <>
      <PublicTopBar2 />
      <Box sx={{ mt: "50px" }}>
        <Outlet />
      </Box>
    </>
  );
}
