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
};

export default ENDPOINTS;
