import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./pages/auth/Login.jsx"
import Register from "./pages/auth/Register.jsx";
import AuthLayout from "./pages/auth/AuthLayout.jsx";
import VerifyOtp from "./pages/auth/VerifyOtp.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import Settings from "./pages/Setting.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./features/slice/userSlice.js";
import Dashboard from "./pages/Dashboard.jsx";
import CoursesPage from "./pages/Courses.jsx";
import UsersPage from "./pages/Users.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import CreateCoursePage from "./components/AddCourses.jsx";
import EnrollmentsPage from "./pages/Enrollments.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import VerifyResetOtp from "./pages/auth/VerifyResetOtp.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch])

  return (
    <div className="w-full h-screen bg-background text-foreground">
      <BrowserRouter>
        {/* for toast message */}
        <Toaster />

        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="course/:courseId" element={<CourseDetail />} />
            <Route path="enrollment" element={<EnrollmentsPage />} />
          </Route>


          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
