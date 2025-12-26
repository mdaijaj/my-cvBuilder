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
      enum: ['modern', 'professional', 'minimal', 'creative', "classic"],
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
        title: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        link: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
        link: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);