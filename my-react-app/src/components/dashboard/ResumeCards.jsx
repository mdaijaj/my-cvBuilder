import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  Visibility,
} from '@mui/icons-material';
import { deleteResume } from '../../redux/slices/resumeSlice';
import { resumeApi } from '../../api/resumeApi';
import { format } from 'date-fns';

const ResumeCard = ({ resume }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!resume) return null; // safety

  const handleEdit = () => {
    navigate(`/resume-builder/${resume._id}`);
  };

  const handlePreview = () => {
    navigate(`/resume-builder/${resume._id}`, {
      state: { preview: true },
    });
  };

  const handleDuplicate = async () => {
    await resumeApi.duplicateResume(resume._id);
    window.location.reload();
  };

  const handleDelete = async () => {
    await dispatch(deleteResume(resume._id));
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6" noWrap>
              {resume.personalInfo?.fullName || 'Untitled Resume'}
            </Typography>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVert />
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {resume.personalInfo?.jobTitle || 'No job title'}
          </Typography>

          <Chip
            label={resume.template || 'Modern'}
            size="small"
            sx={{ mt: 2 }}
          />

          <Typography variant="caption" display="block" mt={2}>
            Last updated: {format(new Date(resume.updatedAt), 'MMM dd, yyyy')}
          </Typography>
        </CardContent>

        <CardActions>
          <Button startIcon={<Visibility />} onClick={handlePreview}>
            Preview
          </Button>
          <Button startIcon={<Edit />} variant="contained" onClick={handleEdit}>
            Edit
          </Button>
        </CardActions>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" /> Edit
        </MenuItem>
        <MenuItem onClick={handlePreview}>
          <Visibility fontSize="small" /> Preview
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <ContentCopy fontSize="small" /> Duplicate
        </MenuItem>
        <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'red' }}>
          <Delete fontSize="small" /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this resume?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResumeCard;
