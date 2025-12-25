const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');

// @desc    Get all resumes for user
// @route   GET /api/resumes
// @access  Private
const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort('-updatedAt');
  res.json(resumes);
});

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (resume && resume.user.toString() === req.user._id.toString()) {
    res.json(resume);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

// @desc    Create resume
// @route   POST /api/resumes
// @access  Private
const createResume = asyncHandler(async (req, res) => {
  const resume = await Resume.create({
    user: req.user._id,
    ...req.body,
  });

  res.status(201).json(resume);
});

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (resume && resume.user.toString() === req.user._id.toString()) {
    Object.assign(resume, req.body);
    const updatedResume = await resume.save();
    res.json(updatedResume);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (resume && resume.user.toString() === req.user._id.toString()) {
    await resume.deleteOne();
    res.json({ message: 'Resume deleted' });
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
const duplicateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (resume && resume.user.toString() === req.user._id.toString()) {
    const duplicated = await Resume.create({
      user: req.user._id,
      template: resume.template,
      personalInfo: resume.personalInfo,
      summary: resume.summary,
      skills: resume.skills,
      experience: resume.experience,
      education: resume.education,
      projects: resume.projects,
      certifications: resume.certifications,
    });
    res.status(201).json(duplicated);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

module.exports = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
};