import React, { useState } from 'react';
import '../../index.css'

import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  IconButton,
  Grid,
  Divider,
  Chip,
  Stack,
  Card,
  CardContent,
  ButtonGroup,
  Avatar,
} from '@mui/material';
import {
  Add,
  Delete,
  Download,
  GitHub,
  Language,
  CalendarToday,
  Business,
  School,
  Code,
  EmojiEvents,
} from '@mui/icons-material';


const PreviewStep = ({ data, selectedTemplate, onTemplateChange }) => {
  const templates = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic', color: 'success' },
    { id: 'creative', name: 'Creative', color: 'secondary' },
  ];
  const TEMPLATE_THEMES = {
    modern: {
      primary: '#1976d2',   // Blue
      secondary: '#424242',
      divider: '#1976d2',
      chip: 'primary',
    },
    classic: {
      primary: '#2e7d32',   // Green
      secondary: '#1b5e20',
      divider: '#2e7d32',
      chip: 'success',
    },
    creative: {
      primary: '#9c27b0',   // Purple
      secondary: '#6a1b9a',
      divider: '#9c27b0',
      chip: 'secondary',
    },
  };

  const theme = TEMPLATE_THEMES[selectedTemplate] || TEMPLATE_THEMES.modern;


  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Preview & Download
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review your resume and download as PDF
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<Download />}
          onClick={handleDownload}
          size="large"
        >
          Download PDF
        </Button>
      </Box>

      {/* Template Selection */}
      <Paper sx={{ p: 3, mb: 3 }} className="no-print">
        <Typography variant="h6" gutterBottom>
          Select Template
        </Typography>
        <ButtonGroup variant="outlined" fullWidth sx={{ mt: 2 }}>
          {templates.map((template) => (
            <Button
              key={template.id}
              onClick={() => onTemplateChange(template.id)}
              variant={selectedTemplate === template.id ? 'contained' : 'outlined'}
              color={template.color}
            >
              {template.name}
            </Button>
          ))}
        </ButtonGroup>
      </Paper>

      {/* Resume Preview */}
      <Paper sx={{ p: 4 }} elevation={3} id="resume-print">
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          {/* Header with Profile Photo */}
          <Box
            sx={{
              borderBottom: 3,
              borderColor: theme.divider,
              pb: 2,
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{ color: theme.primary }}
              >
                {data.personalInfo?.fullName || 'Your Name'}
              </Typography>
              {data.personalInfo?.jobTitle && (
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  {data.personalInfo.jobTitle}
                </Typography>
              )}
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ color: 'text.secondary' }}>
                {data.personalInfo?.email && (
                  <Typography variant="body2">{data.personalInfo.email}</Typography>
                )}
                {data.personalInfo?.phone && (
                  <Typography variant="body2">• {data.personalInfo.phone}</Typography>
                )}
                {data.personalInfo?.address && (
                  <Typography variant="body2">• {data.personalInfo.address}</Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
                {data.personalInfo?.linkedin && (
                  <Typography variant="body2" color="text.secondary">
                    🔗 LinkedIn
                  </Typography>
                )}
                {data.personalInfo?.github && (
                  <Typography variant="body2" color="text.secondary">
                    💻 GitHub
                  </Typography>
                )}
                {data.personalInfo?.portfolio && (
                  <Typography variant="body2" color="text.secondary">
                    🌐 Portfolio
                  </Typography>
                )}
              </Stack>
            </Box>
            
            {/* Profile Photo */}
            {data.personalInfo?.profilePhoto && (
              <Avatar
                src={data.personalInfo.profilePhoto}
                alt={data.personalInfo?.fullName || 'Profile'}
                sx={{
                  width: 120,
                  height: 120,
                  border: `3px solid ${theme.primary}`,
                  flexShrink: 0,
                }}
                onError={(e) => {
                  console.error('Failed to load profile photo:', data.personalInfo.profilePhoto);
                  e.target.style.display = 'none';
                }}
              />
            )}
          </Box>

          {/* Summary */}
          {data.personalInfo?.summary && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: theme.primary, mb: 1 }}
              >
                Professional Summary
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {data.personalInfo.summary}
              </Typography>
            </Box>
          )}

          {/* Experience */}
          {data.experience?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold"  sx={{ color: theme.primary, mb: 1 }}>
                Experience
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Stack spacing={2}>
                {data.experience.map((exp) => (
                  <Box key={exp.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {exp.position}
                        </Typography>
                        <Typography variant="body1"   sx={{ color: theme.secondary }}>
                          {exp.company}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </Typography>
                    </Box>
                    {exp.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {exp.description}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Education */}
          {data.education?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: theme.primary, mb: 1 }}>
                Education
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Stack spacing={2}>
                {data.education.map((edu) => (
                  <Box key={edu.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {edu.degree}
                        </Typography>
                        <Typography variant="body1" sx={{ color: theme.secondary }}>
                          {edu.school}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(edu.graduationDate)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Skills */}
          {data.skills?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: theme.primary, mb: 1 }}>
                Skills
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {data.skills.map((skill) => (
                  <Chip
                    key={skill.id}
                    label={`${skill.name} (${skill.level}/5)`}
                    color={theme.chip}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Projects */}
          {data.projects?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: theme.primary, mb: 1 }}>
                Projects
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Stack spacing={2}>
                {data.projects.map((project) => (
                  <Box key={project.id}>
                    <Typography variant="h6" fontWeight="bold">
                      {project.name}
                    </Typography>
                    {project.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {project.description}
                      </Typography>
                    )}
                    {project.technologies && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        <strong>Technologies:</strong> {project.technologies}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Certifications */}
          {data.certifications?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: theme.primary, mb: 1 }}>
                Certifications
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Stack spacing={2}>
                {data.certifications.map((cert) => (
                  <Box key={cert.id}>
                    <Typography variant="h6" fontWeight="bold">
                      {cert.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cert.issuer} • {formatDate(cert.date)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};


export default PreviewStep;