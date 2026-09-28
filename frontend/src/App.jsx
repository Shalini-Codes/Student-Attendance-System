import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { RoleGuard } from './components/common/RoleGuard';

// Pages
import { Login } from './pages/Login';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentManagement } from './pages/StudentManagement';
import { AttendanceManagement } from './pages/AttendanceManagement';
import { QrAttendance } from './pages/QrAttendance';
import { Reports } from './pages/Reports';
import { StudentDashboard } from './pages/StudentDashboard';
import { ProfileSettings } from './pages/ProfileSettings';

function DashboardRouter() {
  const { role } = useAuth();
  if (role === 'STUDENT') {
    return <StudentDashboard />;
  }
  return <TeacherDashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public Login Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Dynamic Dashboard Router */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />

              {/* Teacher / Admin Routes */}
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['TEACHER', 'ADMIN']}>
                      <StudentManagement />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/attendance"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['TEACHER', 'ADMIN']}>
                      <AttendanceManagement />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/qr-attendance"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['TEACHER', 'ADMIN']}>
                      <QrAttendance />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['TEACHER', 'ADMIN']}>
                      <Reports />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              {/* Student Specific Route */}
              <Route
                path="/my-attendance"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['STUDENT']}>
                      <StudentDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />

              {/* Shared Profile & Settings Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />

              {/* Default Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
