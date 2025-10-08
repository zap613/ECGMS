import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import LoginPage from "./pages/auth/LoginPage"
import LecturerDashboard from "./pages/lecturer/LecturerDashboard"
import CoursesPage from "./pages/lecturer/CoursesPage"
import CourseDetailPage from "./pages/lecturer/CourseDetailPage"
import GroupsPage from "./pages/lecturer/GroupsPage"
import StudentDashboard from "./pages/student/StudentDashboard"
import AdminDashboard from "./pages/admin/AdminDashboard"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Lecturer Routes */}
          <Route
            path="/lecturer"
            element={
              <ProtectedRoute allowedRoles={["lecturer"]}>
                <LecturerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/courses"
            element={
              <ProtectedRoute allowedRoles={["lecturer"]}>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/courses/:courseId"
            element={
              <ProtectedRoute allowedRoles={["lecturer"]}>
                <CourseDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/groups"
            element={
              <ProtectedRoute allowedRoles={["lecturer"]}>
                <GroupsPage />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
