import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Chip,
  Rating,
  Paper,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const SkillsStep = ({ data, onChange, errors }) => {
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState(3);

  const addSkill = () => {
    if (!newSkill.trim()) return;

    onChange([...data, { name: newSkill.trim(), level: skillLevel }]);
    setNewSkill('');
    setSkillLevel(3);
  };

  const removeSkill = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Skills
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add your technical and professional skills with proficiency levels.
      </Typography>

      {/* 🔴 VALIDATION ERROR */}
      {errors?.skills && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.skills}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            label="Skill Name"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., React.js, Project Management"
            sx={{ flex: 1, minWidth: 200 }}
          />

          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" gutterBottom>
              Proficiency Level
            </Typography>
            <Rating
              value={skillLevel}
              onChange={(e, newValue) => setSkillLevel(newValue)}
              max={5}
              size="large"
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addSkill}
            disabled={!newSkill.trim()}
          >
            Add Skill
          </Button>
        </Box>
      </Paper>

      {data.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 4 }}
        >
          No skills added yet. Start adding your skills above.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data.map((skill, index) => (
            <Chip
              key={index}
              label={`${skill.name} (${skill.level}/5)`}
              onDelete={() => removeSkill(index)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SkillsStep;
