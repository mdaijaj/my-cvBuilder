import axios from './axios';

export const authApi = {
  register: (data) => {
    let result=axios.post('/api/auth/register', data)
    console.log("ssss", result)
    return result
  },
  login: (data) => axios.post('/api/auth/login', data),
  googleLogin: (credential) => axios.post('/api/auth/google', { credential }),
  forgotPassword: (email) => axios.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => axios.post('/auth/reset-password', { token, password }),
  getProfile: () => axios.get('/auth/profile'),
  updateProfile: (data) => axios.put('/auth/profile', data),
};