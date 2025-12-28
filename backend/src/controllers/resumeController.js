const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');

const getResumes = asyncHandler(async (req, res) => {
      console.log('User ID:', req.user._id);

  const resumes = await Resume.find({ user: req.user._id }).sort('-updatedAt');
  res.json(resumes);
});


const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (resume && resume.user.toString() === req.user._id.toString()) {
    res.json(resume);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});


const createResume = asyncHandler(async (req, res) => {
  try {
    console.log('Creating resume with data:', req.body);
    console.log('User ID:', req.user._id);
    
    const resume = await Resume.create({
      user: req.user._id,
      ...req.body,
    });

    console.log('Resume created successfully:', resume._id);
    res.status(201).json(resume);
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(400);
    throw new Error(`Failed to create resume: ${error.message}`);
  }
});


const updateResume = asyncHandler(async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this resume');
    }

    console.log('Updating resume with data:', req.body);
    
    Object.assign(resume, req.body);
    const updatedResume = await resume.save();
    
    console.log('Resume updated successfully:', updatedResume._id);
    res.json(updatedResume);
  } catch (error) {
    console.error('Error updating resume:', error);
    if (!res.statusCode || res.statusCode === 200) {
      res.status(400);
    }
    throw new Error(`Failed to update resume: ${error.message}`);
  }
});


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