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
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { fetchResumes } from '../../redux/slices/resumeSlice';
import ResumeCard from './ResumeBuilder';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, isLoading } = useSelector((state) => state.resume);
  console.log("testing", resumes)
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleCreateNew = () => {
    navigate('/resume-builder');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your resumes and create new ones
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNew}
          size="large"
        >
          Create New Resume
        </Button>
      </Box>

      {resumes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No resumes yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first resume to get started
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateNew}>
            Create Resume
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {console.log("aijajkhan", resumes)}
          {/* {resumes.map((resume) => ( */}
            <Grid item xs={12} sm={6} md={4} key={resumes[0]._id}>
              <ResumeCard resume={resumes[0]} />
            </Grid>
          {/* ))} */}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;