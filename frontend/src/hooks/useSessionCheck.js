import { useEffect } from "react";
import axiosInstance from "../api/axios";
import ENDPOINTS from "../api/endpoints";
import { useNavigate } from "react-router-dom";

export default function useSessionCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.AUTH.ME);

        if (res.data.status === "inactive") {
          localStorage.clear();
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.log(error);

        localStorage.clear();
        navigate("/", { replace: true });
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [navigate]);
}
