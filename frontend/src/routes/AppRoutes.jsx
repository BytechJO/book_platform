import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "../pages/Public-Layout/PublicLayout";
import AdminLayout from "../pages/admin/AdminLayout";

import Home from "../pages/Public-Layout/Home";
import About from "../pages/Public-Layout/About";
import Contact from "../pages/Public-Layout/contact";

import Dashboard from "../pages/admin/Dashboard";
import BookSeries from "../pages/Public-Layout/Book-series";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AuthLayout from "../pages/auth/authLayout";
import ProtectedRoute from "../utils/ProtectedRoute";
import Users from "../pages/admin/Users";
import Books from "../pages/admin/books/Books";
import Codes from "../pages/admin/Codes";
import CreateBook from "../pages/admin/books/CreateBook";
import ViewBook from "../pages/admin/books/ViewBook";

export default function AppRoutes() {
  return (
    <Routes>
      {/*  Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-series" element={<BookSeries />} />
      </Route>
      {/*  Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      {/*  Admin Pages */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="books" element={<Books />} />
        <Route path="codes" element={<Codes />} />
        <Route path="books/create" element={<CreateBook />} />
        <Route path ="books/:id/edit" element={<CreateBook />} />
        <Route path="books/:id" element={<ViewBook />} />
      </Route>
    </Routes>
  );
}
