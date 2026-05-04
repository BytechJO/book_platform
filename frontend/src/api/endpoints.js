const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
    UPDATE_PROFILE: "/api/auth/profile",
  },

  BOOKS: {
    CREATE: "/api/books/create",
    ALL: "/api/books/all-books",
    BY_ID: (id) => `/api/books/${id}`,
    DELETE: (id) => `/api/books/${id}/delete`,
    UPDATE: (id) => `/api/books/${id}/update`,
    ALLPuplic: "/api/books/all-books-public",
    ONEPuplic: (id) => `/api/books/all-books-public/${id}`,
    GROWTH: (start) => `/api/books/books-growth?start=${start}`,
    TOP: "/api/books/top-books",
    STATUS: (id) => `/api/books/${id}/status`,
  },

  USERS: {
    ALL: "/api/users/all-users",
    Status: (id) => `/api/users/${id}/status`,
    GROWTH: (start) => `/api/users/users-growth?start=${start}`,
    activity: `/api/users/activities`,
    DELETE: (id) => `/api/users/${id}/delete`,
    USER: (id) => `/api/users/${id}`,
    UPDATE: (id) => `/api/users/${id}`,
  },

  Codes: {
    Create: "/api/code/create",
    ALL: "/api/code/all-codes",
    Import: "/api/code/import",
    getBookCodes: (bookId) => `/api/code/book/${bookId}`,
    DELETE: (codeId) => `/api/code/${codeId}`,
    UPDATE: (codeId) => `/api/code/${codeId}`,
  },

  User_book: {
    Create: "/api/user-books/create",
    my_books: "/api/user-books/my-books",
    my_books_one: (bookId) => `/api/user-books/my-books/${bookId}`,
    AddClass: (id) => `/api/user-books/${id}/class`,
    activateClassCode: (id) => `/api/user-books/${id}/class/student`,
    Student_one: (bookId) => `/api/user-books/student/${bookId}`,
  },

  CATEGORIES: {
    CREATE: "/api/categories",
    ALL: "/api/categories",
    BY_ID: (id) => `/api/categories/${id}`,
  },
};

export default ENDPOINTS;
