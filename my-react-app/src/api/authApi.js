import axios from './axios';

export const authApi = {
  register: (data) => {
    console.log("kkkkkkkk", data)
    let result=axios.post('/auth/register', data)
    console.log("ssss", result)
    return result
  },
  login: (data) => axios.post('/api/auth/login', data),
  forgotPassword: (email) => axios.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => axios.post('/auth/reset-password', { token, password }),
  getProfile: () => axios.get('/auth/profile'),
  updateProfile: (data) => axios.put('/auth/profile', data),
};