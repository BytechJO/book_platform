import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "../pages/Public-Layout/PublicLayout";
import AdminLayout from "../pages/admin/AdminLayout";

import Home from "../pages/Public-Layout/Home/Home";
import About from "../pages/Public-Layout/About";
import Contact from "../pages/Public-Layout/contact";

import Dashboard from "../pages/admin/Dashboard";
import BookSeries from "../pages/Public-Layout/Book-series";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AuthLayout from "../pages/auth/AuthLayout"

import ProtectedRoute from "../utils/ProtectedRoute";
import Users from "../pages/admin/Users";
import Books from "../pages/admin/books/Books";
import Codes from "../pages/admin/Codes";
import CreateBook from "../pages/admin/books/CreateBook";
import ViewBook from "../pages/admin/books/ViewBook";
import TeacherBooks from "../pages/teacher/books/TeacherBooks";
import TeacherLayout from "../pages/teacher/TeacherLayout";
import ViewTeacherBook from "../pages/teacher/books/ViewTeacherBook";
import Help from "../pages/teacher/Help";
import TeacherHome from "../pages/teacher/TeacherHome";
import ViewPuplicBook from "../pages/Public-Layout/ViewPuplicBook";
import NotFound from "../pages/NotFound";
import StudentLayout from "../pages/student/StudentLayout";
import StudentBooks from "../pages/student/books/StudentBooks";
import ViewStudentBook from "../pages/student/books/ViewStudentBook";
import StudentHome from "../pages/student/StudentHome";
import HelpStudent from "../pages/student/Help";
import UserProfile from "../pages/admin/UserProfile";

export default function AppRoutes() {
  return (
    <Routes>
      {/*  Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<ViewPuplicBook />} />
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
        <Route path="books/:id/edit" element={<CreateBook />} />
        <Route path="books/:id" element={<ViewBook />} />
        <Route path="profile" element={<UserProfile />} />
        
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherHome />} />
        <Route path="books" element={<TeacherBooks />} />
        <Route path="books/:id" element={<ViewTeacherBook />} />
        <Route path="help" element={<Help />} />
      </Route>
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentHome />} />
        <Route path="books" element={<StudentBooks />} />
        <Route path="books/:id" element={<ViewStudentBook />} />
        <Route path="help" element={<HelpStudent />} />
      </Route>
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
