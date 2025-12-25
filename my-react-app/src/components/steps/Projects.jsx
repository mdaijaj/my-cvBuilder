import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  IconButton,
  Grid,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import { Add, Delete, Code } from '@mui/icons-material';

const ProjectsStep = ({ data = [], onChange }) => {
  const [errors, setErrors] = useState({});

  const addProject = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        link: '',
        startDate: '',
        endDate: '',
      },
    ]);
  };

  const removeProject = (id) => {
    onChange(data.filter((p) => p.id !== id));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const validateField = (project, field, value) => {
    let message = '';

    if (field === 'name' && !value.trim()) {
      message = 'Project name is required';
    }

    if (field === 'description' && value.trim().length < 20) {
      message = 'Description should be at least 20 characters';
    }

    if (field === 'link' && value) {
      try {
        new URL(value);
      } catch {
        message = 'Invalid URL';
      }
    }

    if (field === 'endDate' && project.startDate && value) {
      if (value < project.startDate) {
        message = 'End date cannot be before start date';
      }
    }

    return message;
  };

  const updateProject = (id, field, value) => {
    const project = data.find((p) => p.id === id);

    const errorMessage = validateField(project, field, value);

    setErrors((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: errorMessage,
      },
    }));

    onChange(
      data.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5">Projects</Typography>
          <Typography variant="body2" color="text.secondary">
            Showcase your best work and personal projects
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={addProject}>
          Add Project
        </Button>
      </Box>

      {/* Empty State */}
      {data.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', border: '2px dashed' }}>
          <Code sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">
            No projects added yet
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {data.map((project, index) => {
            const projectErrors = errors[project.id] || {};

            return (
              <Card key={project.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      Project {index + 1}
                    </Typography>
                    <IconButton color="error" onClick={() => removeProject(project.id)}>
                      <Delete />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Project Name *"
                        value={project.name}
                        error={!!projectErrors.name}
                        helperText={projectErrors.name}
                        onChange={(e) =>
                          updateProject(project.id, 'name', e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description *"
                        value={project.description}
                        error={!!projectErrors.description}
                        helperText={projectErrors.description}
                        onChange={(e) =>
                          updateProject(project.id, 'description', e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Technologies"
                        value={project.technologies}
                        onChange={(e) =>
                          updateProject(project.id, 'technologies', e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="month"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        value={project.startDate}
                        onChange={(e) =>
                          updateProject(project.id, 'startDate', e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="month"
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        value={project.endDate}
                        error={!!projectErrors.endDate}
                        helperText={projectErrors.endDate}
                        onChange={(e) =>
                          updateProject(project.id, 'endDate', e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="url"
                        label="Project Link"
                        value={project.link}
                        error={!!projectErrors.link}
                        helperText={projectErrors.link}
                        onChange={(e) =>
                          updateProject(project.id, 'link', e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default ProjectsStep;
