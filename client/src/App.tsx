import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import JobList from "./pages/jobs/JobList";
import JobDetail from "./pages/jobs/JobDetail";
import PostJob from "./pages/jobs/PostJob";
import DevList from "./pages/devs/DevList";
import DevDetail from "./pages/devs/DevDetail";
import Messages from "./pages/chat/Messages";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import DevDashboard from "./pages/dashboard/DevDashboard";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/devs" element={<DevList />} />
        <Route path="/devs/:id" element={<DevDetail />} />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute roles={["client"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function DashboardRouter() {
  const { user } = useAuth();
  if (user?.role === "client") return <ClientDashboard />;
  if (user?.role === "dev") return <DevDashboard />;
  return <Navigate to="/" replace />;
}
