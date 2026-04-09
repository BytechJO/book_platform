import PublicTopBar from "../../components/layout/PublicTopBar";
import AuthBar from "../../components/layout/AuthBar"; // 👈 اعمل هذا
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
      {showSecondaryBar && <AuthBar />}
      {showhome && <PublicTopBar />}
      <Box sx={{ mt: "50px" }}>
        <Outlet />
      </Box>
    </>
  );
}
