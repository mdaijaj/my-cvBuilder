import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6).required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6).required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const personalInfoSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  jobTitle: yup.string().required('Job title is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string(),
  linkedin: yup.string().url('Invalid URL'),
  github: yup.string().url('Invalid URL'),
  portfolio: yup.string().url('Invalid URL'),
});