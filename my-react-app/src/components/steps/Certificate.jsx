import React from 'react';
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
import { Add, Delete, EmojiEvents } from '@mui/icons-material';

const CertificationsStep = ({ data = [], onChange }) => {
  const addCertification = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        name: '',
        issuer: '',
        date: '',
        credentialId: '',
        link: '',
      },
    ]);
  };

  const removeCertification = (id) => {
    onChange(data.filter((cert) => cert.id !== id));
  };

  const updateCertification = (id, field, value) => {
    onChange(
      data.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5">Certifications</Typography>
          <Typography variant="body2" color="text.secondary">
            Add your professional certifications and licenses
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={addCertification}>
          Add Certification
        </Button>
      </Box>

      {/* Empty State */}
      {data.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'divider',
          }}
        >
          <EmojiEvents sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">
            No certifications added yet
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {data.map((cert, index) => (
            <Card key={cert.id}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    Certification {index + 1}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => removeCertification(cert.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Certification Name *"
                      value={cert.name}
                      onChange={(e) =>
                        updateCertification(cert.id, 'name', e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Issuing Organization *"
                      value={cert.issuer}
                      onChange={(e) =>
                        updateCertification(cert.id, 'issuer', e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="month"
                      label="Issue Date *"
                      InputLabelProps={{ shrink: true }}
                      value={cert.date}
                      onChange={(e) =>
                        updateCertification(cert.id, 'date', e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Credential ID"
                      value={cert.credentialId}
                      onChange={(e) =>
                        updateCertification(cert.id, 'credentialId', e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="url"
                      label="Verification Link"
                      placeholder="https://verify.example.com"
                      value={cert.link}
                      onChange={(e) =>
                        updateCertification(cert.id, 'link', e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CertificationsStep;
