import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "../pages/Public-Layout/PublicLayout";
import AdminLayout from "../pages/admin/AdminLayout";

import Home from "../pages/Public-Layout/Home/Home";
import About from "../pages/Public-Layout/About";
import Contact from "../pages/Public-Layout/contact";

import Dashboard from "../pages/admin/Dashboard/Dashboard";
import BookSeries from "../pages/Public-Layout/Book-series";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AuthLayout from "../pages/auth/AuthLayout";
import Reports from "../pages/admin/Dashboard/reports/Reports";
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
import TeacherHome from "../pages/teacher/teacher_home/TeacherHome";
import TeacherClasses from "../pages/teacher/TeacherClasses";
import TeacherActivities from "../pages/teacher/TeacherActivities";
import StudentClasses from "../pages/student/StudentClasses";
import StudentActivities from "../pages/student/StudentActivities";
import ViewPuplicBook from "../pages/Public-Layout/ViewPuplicBook";
import NotFound from "../pages/NotFound";
import StudentHome from "../pages/student/student_home/studentHome";
import StudentLayout from "../pages/student/StudentLayout";
import StudentBooks from "../pages/student/books/StudentBooks";
import ViewStudentBook from "../pages/student/books/ViewStudentBook";
import HelpStudent from "../pages/student/Help";
import UserProfile from "../pages/admin/UserProfile";
import UserProfileStudent from "../pages/student/UserProfile";
import UserProfileTeacher from "../pages/teacher/UserProfile";
import ViewUser from "../pages/admin/ViewUser";
import CreateEvent from "../pages/teacher/events/CreateEvent";
import ViewEvents from "../pages/teacher/events/ViewEvents";
import ViewEventsStudent from "../pages/student/student_home/ViewEvents";

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
        <Route path="users/:id" element={<ViewUser />} />
        <Route path="books" element={<Books />} />
        <Route path="codes" element={<Codes />} />
        <Route path="reports" element={<Reports />} />
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
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events" element={<ViewEvents />} />
        <Route path="books" element={<TeacherBooks />} />
        <Route path="books/:id" element={<ViewTeacherBook />} />
        <Route path="help" element={<Help />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="activities" element={<TeacherActivities />} />
        <Route path="profile" element={<UserProfileTeacher />} />
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
        <Route path="events" element={<ViewEventsStudent />} />
        <Route path="books/:id" element={<ViewStudentBook />} />
        <Route path="classes" element={<StudentClasses />} />
        <Route path="activities" element={<StudentActivities />} />
        <Route path="help" element={<HelpStudent />} />
        <Route path="profile" element={<UserProfileStudent />} />
      </Route>
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
