import PublicTopBar from "../../components/layout/PublicTopBar";
import PublicTopBar2 from "../../components/layout/HomeBar2"; 
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

export default function PublicLayout() {
  const location = useLocation();

  const showSecondaryBar =
    location.pathname === "/about" ||
    location.pathname === "/contact" ||
    location.pathname === "/book-series" ||
    location.pathname.startsWith("/book");
  const showhome = location.pathname === "/";
  return (
    <>
      {showSecondaryBar && <PublicTopBar2 />}
      {showhome && <PublicTopBar />}
      <Box sx={{ mt: "50px" }}>
        <Outlet />
      </Box>
    </>
  );
}
