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
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const ExperienceStep = ({ data, onChange, errors }) => {
  const [editing, setEditing] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    current: false,
    responsibilities: '',
  });

  const validateForm = () => {
    const errs = {};
    if (!formData.company) errs.company = 'Company is required';
    if (!formData.role) errs.role = 'Role is required';
    if (!formData.startDate) errs.startDate = 'Start date is required';
    return errs;
  };

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: '',
    });
    setEditing(null);
    setFormErrors({});
  };

  const addExperience = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    if (editing !== null) {
      const updated = [...data];
      updated[editing] = formData;
      onChange(updated);
    } else {
      onChange([...data, formData]);
    }

    resetForm();
  };

  const editExperience = (index) => {
    setFormData(data[index]);
    setEditing(index);
  };

  const deleteExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Work Experience
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add your professional work experience in reverse chronological order.
      </Typography>

      {/* 🔴 STEP LEVEL ERROR */}
      {errors?.experience && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.experience}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name *"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              error={Boolean(formErrors.company)}
              helperText={formErrors.company}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Role / Job Title *"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              error={Boolean(formErrors.role)}
              helperText={formErrors.role}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              type="date"
              label="Start Date *"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              error={Boolean(formErrors.startDate)}
              helperText={formErrors.startDate}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              disabled={formData.current}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.current}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current: e.target.checked,
                      endDate: e.target.checked ? '' : formData.endDate,
                    })
                  }
                />
              }
              label="Current"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Responsibilities & Achievements"
              value={formData.responsibilities}
              onChange={(e) =>
                setFormData({ ...formData, responsibilities: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={editing !== null ? <Edit /> : <Add />}
              onClick={addExperience}
            >
              {editing !== null ? 'Update Experience' : 'Add Experience'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {data.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No work experience added yet.
        </Typography>
      ) : (
        data.map((exp, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">{exp.role}</Typography>
                  <Typography color="text.secondary">{exp.company}</Typography>
                  <Typography variant="body2">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'N/A'}
                  </Typography>
                  {exp.responsibilities && (
                    <Typography sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                      {exp.responsibilities}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <IconButton onClick={() => editExperience(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteExperience(index)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ExperienceStep;
