import PublicTopBar from "../../components/layout/PublicTopBar";
import SecondaryBar from "../../components/layout/SecondaryBar"; // 👈 اعمل هذا
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

export default function PublicLayout() {
  const location = useLocation();

  const showSecondaryBar =
    location.pathname === "/about" ||
    location.pathname === "/contact";

  return (
    <>
      <PublicTopBar />

      {showSecondaryBar && <SecondaryBar />} {/* 👈 هون */}

      <Box sx={{ mt: "50px" }}>
        <Outlet />
      </Box>
    </>
  );
}