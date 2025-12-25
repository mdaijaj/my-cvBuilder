import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const SummaryStep = ({ data, onChange, errors }) => {
  const maxChars = 500;
  const hasError = Boolean(errors?.summary);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Professional Summary
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Write a brief summary highlighting your key qualifications, experience, and career goals.
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={10}
        label="Professional Summary"
        value={data}
        onChange={(e) => onChange(e.target.value)}
        error={hasError}
        helperText={
          hasError
            ? errors.summary
            : `${data.length}/${maxChars} characters`
        }
        inputProps={{ maxLength: maxChars }}
        placeholder="Example: Experienced Full Stack Developer with 5+ years building scalable web applications..."
      />
    </Box>
  );
};

export default SummaryStep;
