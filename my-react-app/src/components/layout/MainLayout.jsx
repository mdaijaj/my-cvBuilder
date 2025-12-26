import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../common/Navbar';

const MainLayout = () => {
  const location = useLocation();
  
  // Check if current route is resume builder (for full-width layout)
  const isResumeBuilder = location.pathname.includes('/resume-builder');
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '196vh' }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default',
          ...(isResumeBuilder && {
            bgcolor: '#f5f5f5',
            p: 0,
          })
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;