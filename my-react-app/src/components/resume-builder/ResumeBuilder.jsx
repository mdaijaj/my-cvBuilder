import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  LinearProgress,
} from '@mui/material';
import { NavigateNext, NavigateBefore, Save, Edit as EditIcon, ArrowBack } from '@mui/icons-material';
import { createResume, updateResume } from '../../redux/slices/resumeSlice';
import { resumeApi } from '../../api/resumeApi';
import PersonalInfoStep from '../steps/PersonalInfo';
import SummaryStep from '../steps/Summary';
import SkillsStep from '../steps/Skills';
import ExperienceStep from '../steps/Experience';
import EducationStep from '../steps/Education';
import ProjectsStep from '../steps/Projects';
import CertificationsStep from '../steps/Certificate';
import PreviewStep from '../steps/Preview';

// Initial Resume Data
const initialResumeData = {
  template: 'modern',
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    profilePhoto: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
};

const validateStep = (step, data) => {
  const errors = {};

  switch (step) {
    case 0: // Personal Info
      if (!data.personalInfo.fullName?.trim()) {
        errors.fullName = 'Full Name is required';
      }
      if (!data.personalInfo.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email)) {
        errors.email = 'Invalid email format';
      }
      if (!data.personalInfo.phone?.trim()) {
        errors.phone = 'Phone is required';
      }
      break;

    case 1: // Summary
      if (!data.summary?.trim()) {
        errors.summary = 'Summary is required';
      }
      break;

    case 2: // Skills
      if (!data.skills || data.skills.length === 0) {
        errors.skills = 'At least one skill is required';
      }
      break;

    case 3: // Experience
      if (!data.experience || data.experience.length === 0) {
        errors.experience = 'Add at least one experience';
      }
      break;

    case 4: // Education
      if (!data.education || data.education.length === 0) {
        errors.education = 'Add at least one education';
      }
      break;

    default:
      break;
  }

  return errors;
};

const ResumeBuilderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const mode = searchParams.get('mode'); // 'edit' or 'preview'
  
  const [activeStep, setActiveStep] = useState(mode === 'preview' ? 7 : 0);
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isPreviewMode, setIsPreviewMode] = useState(mode === 'preview');

  const steps = [
    'Personal Info',
    'Summary',
    'Skills',
    'Experience',
    'Education',
    'Projects',
    'Certifications',
    'Preview'
  ];

  // Calculate progress
  const progress = ((activeStep + 1) / steps.length) * 100;

  // Load resume data when ID changes
  useEffect(() => {
    if (id) {
      setLoading(true);
      console.log('Loading resume with ID:', id);
      
      resumeApi.getResumeById(id)
        .then((res) => {
          console.log('Resume loaded:', res.data);
          setResumeData(res.data);
          setSelectedTemplate(res.data.template || 'modern');
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load resume:', err);
          setSnackbar({
            open: true,
            message: 'Failed to load resume',
            severity: 'error'
          });
          setLoading(false);
          setTimeout(() => navigate('/dashboard'), 2000);
        });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (mode === 'preview') {
      setIsPreviewMode(true);
      setActiveStep(7);
    } else if (mode === 'edit') {
      setIsPreviewMode(false);
      if (activeStep === 7) {
        setActiveStep(0);
      }
    }
  }, [mode]);

  const handleNext = () => {
    const stepErrors = validateStep(activeStep, resumeData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'warning'
      });
      return;
    }

    setErrors({});
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = (stepIndex) => {
    if (isPreviewMode) return;
    setActiveStep(stepIndex);
  };

  const handleEnableEdit = () => {
    setIsPreviewMode(false);
    setSearchParams({ mode: 'edit' });
    setActiveStep(0);
  };

  const handleSave = async () => {
    if (activeStep < steps.length - 1) {
      const stepErrors = validateStep(activeStep, resumeData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setSnackbar({
          open: true,
          message: 'Please fill all required fields',
          severity: 'warning'
        });
        return;
      }
    }

    setSaving(true);
    console.log('Saving resume...', { id, resumeData, selectedTemplate });

    try {
      const payload = { ...resumeData, template: selectedTemplate };

      if (id) {
        const result = await dispatch(updateResume({ id, data: payload }));
        
        if (updateResume.fulfilled.match(result)) {
          console.log('Resume updated successfully:', result.payload);
          setSnackbar({
            open: true,
            message: 'Resume updated successfully!',
            severity: 'success'
          });
          setResumeData(result.payload);
        } else {
          throw new Error(result.error?.message || 'Failed to update resume');
        }
      } else {
        const result = await dispatch(createResume(payload));
        
        if (createResume.fulfilled.match(result)) {
          console.log('Resume created successfully:', result.payload);
          setSnackbar({
            open: true,
            message: 'Resume created successfully!',
            severity: 'success'
          });
          
          if (result.payload?._id) {
            navigate(`/resume-builder/${result.payload._id}?mode=edit`, { replace: true });
          }
        } else {
          throw new Error(result.error?.message || 'Failed to create resume');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save resume',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <PersonalInfoStep
            data={resumeData.personalInfo}
            errors={errors}
            onChange={(val) => setResumeData({ ...resumeData, personalInfo: val })}
          />
        );
      case 1:
        return (
          <SummaryStep
            data={resumeData.summary}
            errors={errors}
            onChange={(val) => setResumeData({ ...resumeData, summary: val })}
          />
        );
      case 2:
        return (
          <SkillsStep
            data={resumeData.skills}
            errors={errors}
            onChange={(val) => setResumeData({ ...resumeData, skills: val })}
          />
        );
      case 3:
        return (
          <ExperienceStep
            data={resumeData.experience}
            errors={errors}
            onChange={(val) => setResumeData({ ...resumeData, experience: val })}
          />
        );
      case 4:
        return (
          <EducationStep
            data={resumeData.education}
            errors={errors}
            onChange={(val) => setResumeData({ ...resumeData, education: val })}
          />
        );
      case 5:
        return (
          <ProjectsStep
            data={resumeData.projects}
            errors={errors}
            onChange={(val) => setResumeData({ ...resumeData, projects: val })}
          />
        );
      case 6:
        return (
          <CertificationsStep
            data={resumeData.certifications}
            errors={errors}
            onChange={(val) => setResumeData({ ...resumeData, certifications: val })}
          />
        );
      case 7:
        return (
          <PreviewStep
            data={resumeData}
            selectedTemplate={selectedTemplate}
            onTemplateChange={isPreviewMode ? null : setSelectedTemplate}
            readOnly={isPreviewMode}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: '#f5f5f5'
        }}
      >
        <Paper sx={{ p: 6, textAlign: 'center', minWidth: 300 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Loading resume...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 4 }}>
      {/* Progress Bar */}
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 6,
          bgcolor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          }
        }} 
      />

      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 3,
          mb: 0,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.5)',
                  }
                }}
              >
                Dashboard
              </Button>
              <Typography variant="h5" fontWeight="bold">
                {id ? 'Edit Resume' : 'Create New Resume'}
              </Typography>
              {isPreviewMode && (
                <Chip 
                  label="Preview Mode" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              )}
            </Box>
            
            {isPreviewMode && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEnableEdit}
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  }
                }}
              >
                Enable Edit Mode
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Alert for Preview Mode */}
        {isPreviewMode && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleEnableEdit}>
                EDIT
              </Button>
            }
          >
            You are viewing this resume in preview mode. Click "Enable Edit Mode" to make changes.
          </Alert>
        )}

        <Paper sx={{ p: 4, borderRadius: 2 }} elevation={3}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
            {steps.map((label, index) => (
              <Step 
                key={label}
                onClick={() => handleStepClick(index)}
                sx={{ 
                  cursor: isPreviewMode ? 'default' : 'pointer',
                  '&:hover': !isPreviewMode && {
                    '& .MuiStepLabel-label': {
                      color: 'primary.main',
                      fontWeight: 'bold'
                    }
                  }
                }}
              >
                <StepLabel>
                  <Typography variant="caption" sx={{ fontWeight: activeStep === index ? 'bold' : 'normal' }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box sx={{ minHeight: '500px', py: 3 }}>
            {renderStep()}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
            <Button
              disabled={activeStep === 0 || isPreviewMode}
              onClick={handleBack}
              startIcon={<NavigateBefore />}
              variant="outlined"
              size="large"
            >
              Back
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isPreviewMode && (
                <Button
                  variant="outlined"
                  startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                  onClick={handleSave}
                  disabled={saving}
                  size="large"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </Button>
              )}
              
              {activeStep < steps.length - 1 && !isPreviewMode && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<NavigateNext />}
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Next
                </Button>
              )}
              
              {activeStep === steps.length - 1 && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate('/dashboard')}
                  size="large"
                >
                  {isPreviewMode ? 'Back to Dashboard' : 'Finish & Go to Dashboard'}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeBuilderDetails;