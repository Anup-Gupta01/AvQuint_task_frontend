import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#1E293B',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: 'Inter, -apple-system, sans-serif',
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              padding: '10px 14px',
            },
            success: {
              iconTheme: { primary: '#059669', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#DC2626', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
