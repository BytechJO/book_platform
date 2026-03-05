const BASE_URL = "https://book-platform-jsy9.onrender.com";

const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    ME: `${BASE_URL}/api/auth/me`,
  },
  BOOKS: {
    CREATE: `${BASE_URL}/api/books/create`,
    ALL: `${BASE_URL}/api/books/all-books`,
    BY_ID: (id) => `${BASE_URL}/api/books/${id}`,
    DELETE: (id) => `${BASE_URL}/api/books/${id}/delete`,
    UPDATE: (id) => `${BASE_URL}/api/books/${id}/update`,
    ALLPuplic: `${BASE_URL}/api/books/all-books-public`,
    ONEPuplic: (id) => `${BASE_URL}/api/books/all-books-public/${id}`,
  },
  USERS: {
    ALL: `${BASE_URL}/api/users/all-users`,
    Status: (id) => `${BASE_URL}/api/users/${id}/status`,
  },
  Codes: {
    Create: `${BASE_URL}/api/code/create`,
    ALL: `${BASE_URL}/api/code/all-codes`,
    Import: `${BASE_URL}/api/code/import`,
    getBookCodes: (bookId) => `${BASE_URL}/api/code/book/${bookId}`,
  },
  User_book: {
    Create: `${BASE_URL}/api/user-books/create`,
    my_books: `${BASE_URL}/api/user-books/my-books`,
    my_books_one: (bookId) => `${BASE_URL}/api/user-books/my-books/${bookId}`,
  },
};

export default ENDPOINTS;
