import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
// import ForgotPassword from './components/auth/';
import Dashboard from './components/dashboard/Dashboard';
import ResumeBuilder from './components/dashboard/ResumeBuilder';
import PrivateRoute from './components/auth/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ResumeCard from './components/dashboard/ResumeCards';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log("isAuthenticated", isAuthenticated)

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      </Route>

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /></PrivateRoute> }/>
        <Route path="/resume-builder/:id" element={ <PrivateRoute> <ResumeCard /> </PrivateRoute> } />
        <Route path="/resume-builder"  element={ <PrivateRoute><ResumeBuilder /></PrivateRoute> } />
      </Route>


      {/* Default Route */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;