import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TeachBar from "../../components/layout/TeachBar";
import useSessionCheck from "../../hooks/useSessionCheck";

export default function StudentLayout() {
    useSessionCheck();
  
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TeachBar />

      <Box
        sx={{
          width: "100%",
          flex: 1,
          mt: "100px",  
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
