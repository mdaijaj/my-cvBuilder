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

const ResumeCard = ({ resume, onResumeUpdated }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  if (!resume) return null;

  const handleEdit = () => {
    setAnchorEl(null);
    navigate(`/resume-builder/${resume._id}?mode=edit`);
  };

  const handlePreview = () => {
    setAnchorEl(null);
    navigate(`/resume-builder/${resume._id}?mode=preview`);
  };

  const handleDuplicate = async () => {
    setAnchorEl(null);
    setDuplicating(true);
    
    try {
      const response = await resumeApi.duplicateResume(resume._id);
      
      if (response.data?._id) {
        if (onResumeUpdated) {
          onResumeUpdated();
        }
        navigate(`/resume-builder/${response.data._id}?mode=edit`);
      }
    } catch (error) {
      console.error('Error duplicating resume:', error);
      alert('Failed to duplicate resume. Please try again.');
    } finally {
      setDuplicating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteResume(resume._id)).unwrap();
      setDeleteDialogOpen(false);
        if (onResumeUpdated) {
        onResumeUpdated();
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          '&:hover': {
            boxShadow: 3,
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <Typography variant="h6" noWrap sx={{ flexGrow: 1, mr: 1, fontWeight: 600 }}>
              {resume.personalInfo?.fullName || 'Untitled Resume'}
            </Typography>
            <IconButton 
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ mt: -1 }}
            >
              <MoreVert />
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 1 }}>
            {resume.personalInfo?.jobTitle || 'No job title'}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Chip
              label={resume.template || 'Modern'}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Typography variant="caption" display="block" mt={2} color="text.secondary">
            Last updated: {format(new Date(resume.updatedAt), 'MMM dd, yyyy')}
          </Typography>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button 
            size="small"
            startIcon={<Visibility />} 
            onClick={handlePreview}
            fullWidth
            variant="outlined"
          >
            Preview
          </Button>
          <Button 
            size="small"
            startIcon={<Edit />} 
            variant="contained" 
            onClick={handleEdit}
            fullWidth
          >
            Edit
          </Button>
        </CardActions>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 180 }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <Typography>Edit</Typography>
        </MenuItem>
        
        <MenuItem onClick={handlePreview}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <Typography>Preview</Typography>
        </MenuItem>
        
        <MenuItem onClick={handleDuplicate} disabled={duplicating}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <Typography>{duplicating ? 'Duplicating...' : 'Duplicate'}</Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            setAnchorEl(null);
            setDeleteDialogOpen(true);
          }} 
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>"{resume.personalInfo?.fullName || 'this resume'}"</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={handleDelete}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResumeCard;