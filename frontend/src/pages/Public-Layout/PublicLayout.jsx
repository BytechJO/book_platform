import PublicTopBar from "../../components/layout/PublicTopBar";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <PublicTopBar />
      <Outlet />
    </>
  );
}