import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { NavigateNext, NavigateBefore, Save } from '@mui/icons-material';
import { createResume, updateResume } from '../../redux/slices/resumeSlice';
import { resumeApi } from '../../api/resumeApi';

// Import all steps
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

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});


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

  useEffect(() => {
    if (id) {
      resumeApi.getResumeById(id).then((res) => {
        setResumeData(res.data);
        setSelectedTemplate(res.data.template || 'modern');
      }).catch(err => {
        console.error('Failed to load resume:', err);
      });
    }
  }, [id]);

  const handleNext = () => {
    const stepErrors = validateStep(activeStep, resumeData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSave = async () => {
    const stepErrors = validateStep(activeStep, resumeData);
    console.log("activeStep", activeStep)
    console.log("resumeData", resumeData)


    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = { ...resumeData, template: selectedTemplate };
      console.log("payload", payload)

      if (id) {
        // Update existing resume
        const result = await dispatch(updateResume({ id, data: payload })).unwrap();
        console.log('Resume updated:', result);
        alert('Resume saved successfully!');
      } else {
        // Create new resume
        const result = await dispatch(createResume(payload)).unwrap();
        console.log('Resume created:', result);
        
        if (result._id) {
          navigate(`/resume-builder/${result._id}`, { replace: true });
          alert('Resume created successfully!');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save resume: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInfoStep
          data={resumeData.personalInfo}
          errors={errors}
          onChange={(val) =>
            setResumeData({ ...resumeData, personalInfo: val })
          }
        />
      case 1:
        return <SummaryStep 
          data={resumeData.summary} 
          errors={errors}
          onChange={(val) => setResumeData({ ...resumeData, summary: val })} 
        />;
      case 2:
        return <SkillsStep 
          data={resumeData.skills} 
          errors={errors}
          onChange={(val) => setResumeData({ ...resumeData, skills: val })} 
        />;
      case 3:
        return <ExperienceStep 
          data={resumeData.experience} 
          errors={errors}
          onChange={(val) => setResumeData({ ...resumeData, experience: val })} 
        />;
      case 4:
        return <EducationStep 
          data={resumeData.education} 
          errors={errors}
          onChange={(val) => setResumeData({ ...resumeData, education: val })} 
        />;
      case 5:
        return <ProjectsStep 
          data={resumeData.projects} 
          errors={errors}
          onChange={(val) => setResumeData({ ...resumeData, projects: val })} 
        />;
      case 6:
        return <CertificationsStep 
          data={resumeData.certifications} 
          errors={errors}
          onChange={(val) => setResumeData({ ...resumeData, certifications: val })} 
        />;
      case 7:
        return <PreviewStep 
          data={resumeData} 
          selectedTemplate={selectedTemplate} 
          onTemplateChange={setSelectedTemplate} 
        />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Edit Resume' : 'Create New Resume'}
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: '400px', py: 3 }}>
          {renderStep()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            disabled={activeStep === 0} 
            onClick={handleBack} 
            startIcon={<NavigateBefore />}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<Save />} 
              onClick={handleSave} 
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            {activeStep < steps.length - 1 && (
              <Button 
                variant="contained" 
                onClick={handleNext} 
                endIcon={<NavigateNext />}
              >
                Next
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button 
                variant="contained" 
                color="success"
                onClick={() => navigate('/dashboard')}
              >
                Finish & Go to Dashboard
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResumeBuilder;