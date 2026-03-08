import axios from "axios";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://book-platform-jsy9.onrender.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// يضيف التوكن مع كل request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// يمسك الأخطاء القادمة من السيرفر
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error;
    const status = error.response?.status;

    if (status === 401 || message === "Token expired") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;