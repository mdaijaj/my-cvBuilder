import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgetPassword';
import Dashboard from './components/dashboard/Dashboard';
import ResumeBuilder from './components/dashboard/ResumeBuilder';
import PrivateRoute from './components/auth/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ResumeCard from './components/dashboard/ResumeCards';
import ResumeBuilderDetails from './components/resume-builder/ResumeBuilder';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log("isAuthenticated", isAuthenticated)
  const GOOGLE_CLIENT_ID = '255109659141-vk37qhedo169gak58v5f5bvd31emon17.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /></PrivateRoute> }/>
        <Route path="/resume-builder/:id" element={ <PrivateRoute> <ResumeBuilderDetails /> </PrivateRoute> } />
        <Route path="/resume-builder"  element={ <PrivateRoute><ResumeBuilder /></PrivateRoute> } />
      </Route>


      {/* Default Route */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;