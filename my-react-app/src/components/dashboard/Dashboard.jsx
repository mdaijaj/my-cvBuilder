import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  alpha,
} from '@mui/material';
import { Add, Description, TrendingUp } from '@mui/icons-material';
import { fetchResumes } from '../../redux/slices/resumeSlice';
import ResumeCard from './ResumeCards';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, loading, error } = useSelector((state) => state.resume);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleCreateNew = () => {
    navigate('/resume-builder');
  };

  const handleResumeUpdated = () => {
    dispatch(fetchResumes());
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' 
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            border: '2px dashed #f44336'
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            Error loading resumes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {error.message || error}
          </Typography>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => dispatch(fetchResumes())}
          >
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 6,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" gutterBottom fontWeight="bold">
                Welcome back, {user?.name}! 👋
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Manage your resumes and create stunning CVs
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {resumes.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Resumes
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {resumes.filter(r => r.updatedAt).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Active
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleCreateNew}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: alpha('#ffffff', 0.9),
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Create New Resume
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {resumes.length === 0 ? (
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              border: '2px dashed #667eea',
              borderRadius: 3,
            }}
          >
            <Description sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              No Resumes Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Start building your professional resume today. Choose from multiple templates and create a stunning CV in minutes.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleCreateNew}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Create Your First Resume
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                Your Resumes
              </Typography>
              <Chip
                label={`${resumes.length} Resume${resumes.length !== 1 ? 's' : ''}`}
                color="primary"
                variant="outlined"
              />
            </Box>
            <Grid container spacing={3}>
              {resumes.map((resume) => (
                <Grid item xs={12} sm={6} md={4} key={resume._id}>
                  <ResumeCard 
                    resume={resume} 
                    onResumeUpdated={handleResumeUpdated}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;