import AuthBar from "../../components/layout/AuthBar";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <AuthBar />
      <Outlet />
    </>
  );
}