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
    DELETE: (id) => `/api/books/${id}/delete`,
    UPDATE: (id) => `/api/books/${id}/update`,
  },
  USERS: {
    ALL: "/api/users/all-users",
    Status: (id) => `/api/users/${id}/status`,
  },
  Codes: {
    Create: "/api/code/create",
    ALL: "/api/code/all-codes",
    Import: "/api/code/import",
    getBookCodes: (bookId) => `/api/code/book/${bookId}`,
  },
};

export default ENDPOINTS;
