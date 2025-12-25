import axios from './axios';

export const resumeApi = {
  getAllResumes: () => axios.get('/resumes'),
  getResumeById: (id) => axios.get(`/resumes/${id}`),
  createResume: (data) => axios.post('/resumes', data),
  updateResume: (id, data) => axios.put(`/resumes/${id}`, data),
  deleteResume: (id) => axios.delete(`/resumes/${id}`),
  duplicateResume: (id) => axios.post(`/resumes/${id}/duplicate`),
};