import { Code } from "@mui/icons-material";

const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
  },
  BOOKS: {
    CREATE: "/api/books/create",
    ALL: "/api/books/all-books",
    BY_ID: (id) => `/api/books/${id}`,
  },
  USERS: {
    ALL: "/api/users/all-users",
  },
  CodeS: {
    Create: "/api/code/create",
    ALL: "/api/code/all-codes",
  },
};

export default ENDPOINTS;
