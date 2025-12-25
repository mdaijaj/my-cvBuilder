const express = require('express');
const {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/');
router.get(protect, getResumes)
router.post(protect, createResume);
router.get('/:id').get(protect);
router.get(getResumeById);
router.put(protect, updateResume)
router.delete(protect, deleteResume);
router.post('/:id/duplicate', protect, duplicateResume);

module.exports = router;