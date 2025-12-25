const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    template: {
      type: String,
      enum: ['modern', 'professional', 'minimal', 'creative'],
      default: 'modern',
    },
    personalInfo: {
      fullName: String,
      jobTitle: String,
      email: String,
      phone: String,
      address: String,
      profilePhoto: String,
      linkedin: String,
      github: String,
      portfolio: String,
    },
    summary: String,
    skills: [
      {
        name: String,
        level: Number,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        responsibilities: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String,
        grade: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        techStack: String,
        github: String,
        liveUrl: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        year: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);