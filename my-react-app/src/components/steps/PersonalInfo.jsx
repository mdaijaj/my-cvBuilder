import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Avatar,
  Button,
  CircularProgress,
} from '@mui/material';
import { CloudUpload, LinkedIn, GitHub, Language } from '@mui/icons-material';
import { uploadApi } from '../../api/uploadApi';

const PersonalInfoStep = ({ data, onChange, errors }) => {
  const [photoPreview, setPhotoPreview] = useState(data.profilePhoto);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    onChange({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

const handlePhotoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  try {
    const result = await uploadApi.uploadImage(file);
    // ✅ The URL is now already complete from uploadApi
    const photoUrl = result.data.url;

    setPhotoPreview(photoUrl);
    onChange({ ...data, profilePhoto: photoUrl });
  } catch (error) {
    console.error('Upload error:', error);
    // Optional: Add error handling/notification here
  } finally {
    setUploading(false);
  }
};


  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Personal Information
      </Typography>

      <Grid container spacing={3}>
        {/* Photo */}
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Avatar src={photoPreview} sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} />
          <Button
            variant="outlined"
            component="label"
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
            <input hidden type="file" accept="image/*" onChange={handlePhotoUpload} />
          </Button>
        </Grid>

        {/* Full Name */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="fullName"
            label="Full Name *"
            value={data.fullName}
            onChange={handleChange}
            error={Boolean(errors?.fullName)}
            helperText={errors?.fullName}
          />
        </Grid>

        {/* Job Title */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="jobTitle"
            label="Job Title"
            value={data.jobTitle}
            onChange={handleChange}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="email"
            label="Email *"
            value={data.email}
            onChange={handleChange}
            error={Boolean(errors?.email)}
            helperText={errors?.email}
          />
        </Grid>

        {/* Phone */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="phone"
            label="Phone *"
            value={data.phone}
            onChange={handleChange}
            error={Boolean(errors?.phone)}
            helperText={errors?.phone}
          />
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="address"
            label="Address"
            value={data.address}
            onChange={handleChange}
          />
        </Grid>

        {/* LinkedIn */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="linkedin"
            label="LinkedIn"
            value={data.linkedin}
            onChange={handleChange}
            InputProps={{ startAdornment: <LinkedIn sx={{ mr: 1 }} /> }}
          />
        </Grid>

        {/* GitHub */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="github"
            label="GitHub"
            value={data.github}
            onChange={handleChange}
            InputProps={{ startAdornment: <GitHub sx={{ mr: 1 }} /> }}
          />
        </Grid>

        {/* Portfolio */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="portfolio"
            label="Portfolio"
            value={data.portfolio}
            onChange={handleChange}
            InputProps={{ startAdornment: <Language sx={{ mr: 1 }} /> }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoStep;
