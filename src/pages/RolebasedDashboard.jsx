import { useSelector } from "react-redux";
import AdminDashboard from "./Dashboard.jsx";
import StudentDashboard from "./StudentDashboard.jsx";

export default function RoleBasedDashboard() {
  const { currentUser } = useSelector((state) => state.users);

  const role = currentUser?.role;

  if (role === "ADMIN" || role === "INSTRUCTOR") {
    return <AdminDashboard />
  } else {
    return <StudentDashboard />
  
  }
  
}