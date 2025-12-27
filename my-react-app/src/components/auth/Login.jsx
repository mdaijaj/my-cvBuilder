import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link as MuiLink,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Description,
} from '@mui/icons-material';
import { login, googleLogin } from '../../redux/slices/authSlice';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await dispatch(googleLogin(credentialResponse.credential));
      if (googleLogin.fulfilled.match(result)) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: "196vh",
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {/* Left Side - Branding */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              color: 'white',
              maxWidth: 500,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Description sx={{ fontSize: 60, mr: 2 }} />
              <Typography variant="h3" fontWeight="bold">
                ResumeBuilder
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 300 }}>
              Create Professional Resumes in Minutes
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
              • Multiple professional templates
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
              • Easy-to-use interface
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
              • Download as PDF instantly
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
              • Save and edit anytime
            </Typography>
          </Box>

          {/* Right Side - Login Form */}
          <Paper
            elevation={24}
            sx={{
              p: 5,
              width: '100%',
              maxWidth: 480,
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mb: 2,
                }}
              >
                <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue to your dashboard
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}

            {/* Google Login Button */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
                width="100%"
              />
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot password?
                </MuiLink>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? (
                  <CircularProgress size={26} sx={{ color: 'white' }} />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <MuiLink
                    component={Link}
                    to="/register"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Create Account
                  </MuiLink>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;