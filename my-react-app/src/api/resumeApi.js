import axios from './axios';

export const resumeApi = {
  getAllResumes: () => axios.get('/api/resumes'),
  getResumeById: (id) => axios.get(`/api/resumes/${id}`),
  createResume: (data) => axios.post('/api/resumes', data),
  updateResume: (id, data) => axios.put(`/api/resumes/${id}`, data),
  deleteResume: (id) => axios.delete(`/api/resumes/${id}`),
  duplicateResume: (id) => axios.post(`/api/resumes/${id}/duplicate`),
};