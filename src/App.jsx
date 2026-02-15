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
import CoursesPage from "./pages/Course.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch])

  return (
    <div className="w-full h-screen bg-stone-50 text-stone-900">
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
            <Route path="enrollment" element={<div className="bg-stone-50 text-stone-900">Welcome to enrollments page.</div>} />
            <Route path="modules" element={<div className="bg-stone-50 text-stone-900">Welcome to modules page.</div>} />
          </Route>


          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/auth/verify-otp" element={<VerifyOtp />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
