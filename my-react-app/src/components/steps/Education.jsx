import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  IconButton,
  Alert,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const EducationStep = ({ data, onChange, errors }) => {
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    year: '',
    grade: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errs = {};
    if (!formData.degree) errs.degree = 'Degree is required';
    if (!formData.institution) errs.institution = 'Institution is required';
    return errs;
  };

  const addEducation = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    onChange([...data, formData]);
    setFormData({ degree: '', institution: '', year: '', grade: '' });
    setFormErrors({});
  };

  const deleteEducation = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Education
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add your educational qualifications.
      </Typography>

      {/* 🔴 STEP-LEVEL ERROR */}
      {errors?.education && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.education}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Degree *"
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              error={Boolean(formErrors.degree)}
              helperText={formErrors.degree}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="College / University *"
              value={formData.institution}
              onChange={(e) =>
                setFormData({ ...formData, institution: e.target.value })
              }
              error={Boolean(formErrors.institution)}
              helperText={formErrors.institution}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Year"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              placeholder="e.g., 2020–2024"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Grade / Percentage"
              value={formData.grade}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
              placeholder="e.g., 3.8 GPA, 85%"
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" startIcon={<Add />} onClick={addEducation}>
              Add Education
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {data.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No education added yet.
        </Typography>
      ) : (
        data.map((edu, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">{edu.degree}</Typography>
                  <Typography color="text.secondary">{edu.institution}</Typography>
                  <Typography variant="body2">
                    {edu.year} {edu.grade && `| ${edu.grade}`}
                  </Typography>
                </Box>
                <IconButton color="error" onClick={() => deleteEducation(index)}>
                  <Delete />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default EducationStep;
