import React, { useState, useEffect } from 'react';
import '../../index.css'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Chip,
  Stack,
  ButtonGroup,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Download,
  Lock,
} from '@mui/icons-material';

const PreviewStep = ({ data, selectedTemplate, onTemplateChange, readOnly = false }) => {
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

  const templates = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic', color: 'success' },
    { id: 'creative', name: 'Creative', color: 'secondary' },
  ];

  const TEMPLATE_THEMES = {
    modern: {
      primary: '#1976d2',
      secondary: '#424242',
      divider: '#1976d2',
      chip: 'primary',
    },
    classic: {
      primary: '#2e7d32',
      secondary: '#1b5e20',
      divider: '#2e7d32',
      chip: 'success',
    },
    creative: {
      primary: '#9c27b0',
      secondary: '#6a1b9a',
      divider: '#9c27b0',
      chip: 'secondary',
    },
  };

  const theme = TEMPLATE_THEMES[selectedTemplate] || TEMPLATE_THEMES.modern;

  // Add beforeunload event listener to warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave? Your resume data will be lost.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Mark changes as saved after successful download
  const markAsSaved = () => {
    setHasUnsavedChanges(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Initialize Razorpay Payment
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Payment
  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Load Razorpay script
    const res = await initializeRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 9,
        }),
      });

      const orderData = await response.json();

      // Razorpay options
      const options = {
        key: 'rzp_test_Rwsplfx5C62L66',
        amount: orderData.amount,
        currency: 'INR',
        name: 'Resume Builder',
        description: 'Download Premium Resume PDF',
        order_id: orderData.orderId,
        handler: function (response) {
          console.log('Payment successful:', response);
          setIsPaid(true);
          setPaymentDialog(false);
          setIsProcessing(false);
          
          // Verify payment on backend
          verifyPayment(response);
          
          // Proceed to download
          generatePDF();
        },
        prefill: {
          name: data.personalInfo?.fullName || '',
          email: data.personalInfo?.email || '',
          contact: data.personalInfo?.phone || '',
        },
        theme: {
          color: '#1976d2',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            alert('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  // Verify payment on backend
  const verifyPayment = async (paymentData) => {
    try {
      const response = await fetch('http://localhost:5000/api/verify-razorpay-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        alert('Payment verification failed. Please contact support.');
        setIsPaid(false);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
    }
  };

  // Generate PDF
  const generatePDF = async () => {
    const element = document.getElementById('resume-print');
    
    if (!element) {
      console.error('Resume element not found');
      return;
    }

    try {
      const noPrintElements = document.querySelectorAll('.no-print');
      noPrintElements.forEach(el => {
        el.style.display = 'none';
      });

      const resumeContent = element.querySelector('div');
      
      const canvas = await html2canvas(resumeContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: resumeContent.scrollWidth,
        windowHeight: resumeContent.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; 

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20); 

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }

      pdf.save('resume.pdf');

      // Mark as saved after successful download
      markAsSaved();

      noPrintElements.forEach(el => {
        el.style.display = '';
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Handle download button click
  const handleDownload = () => {
    if (isPaid) {
      generatePDF();
    } else {
      setPaymentDialog(true);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Preview & Download
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review your resume and download as PDF
          </Typography>
          {hasUnsavedChanges && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 0.5 }}>
              ⚠️ Make sure to download your resume before leaving this page
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color={isPaid ? "success" : "primary"}
          startIcon={isPaid ? <Download /> : <Lock />}
          onClick={handleDownload}
          size="large"
        >
          {isPaid ? 'Download PDF' : 'Pay ₹1 & Download'}
        </Button>
      </Box>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => !isProcessing && setPaymentDialog(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lock color="primary" />
            <Typography variant="h6">Complete Payment to Download</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Download your professionally formatted resume as PDF for just ₹1
          </Typography>
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              ₹1
            </Typography>
            <Typography variant="body2" color="text.secondary">
              One-time payment • Instant download
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            ✓ High-quality PDF format
            <br />
            ✓ Professional templates
            <br />
            ✓ Secure payment via Razorpay
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setPaymentDialog(false)} 
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : null}
          >
            {isProcessing ? 'Processing...' : 'Proceed to Pay'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Selection */}
          {/* Template Selection */}
      <Paper sx={{ p: 3, mb: 3 }} className="no-print">
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Select Template
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          {templates.map((template) => (
            <Paper
              key={template.id}
              elevation={selectedTemplate === template.id ? 8 : 2}
              sx={{
                width: 280,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedTemplate === template.id ? `3px solid ${TEMPLATE_THEMES[template.id].primary}` : '1px solid #e0e0e0',
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => onTemplateChange(template.id)}
            >
              {/* Template Preview */}
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: 320 }}>
                <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, height: '100%' }}>
                  {/* Check if it's sidebar template */}
                  {template.id === 'sidebar' ? (
                    // Sidebar Layout Preview
                    <Box sx={{ display: 'flex', height: '100%', gap: 1 }}>
                      {/* Sidebar Section */}
                      <Box sx={{ 
                        width: '35%', 
                        bgcolor: TEMPLATE_THEMES[template.id].sidebarBg, 
                        color: TEMPLATE_THEMES[template.id].sidebarText,
                        p: 1,
                        borderRadius: 0.5,
                      }}>
                        <Typography variant="h6" sx={{ fontSize: '0.85rem', fontWeight: 'bold', mb: 1 }}>
                          John
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: '0.85rem', fontWeight: 'bold', mb: 1 }}>
                          Doe
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.55rem', display: 'block', mb: 1, opacity: 0.9 }}>
                          A brief intro goes here.
                        </Typography>
                        
                        <Box sx={{ mb: 1, mt: 1.5 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                            Education
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.5rem', display: 'block', opacity: 0.8 }}>
                            No data provided
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                            Projects
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.5rem', display: 'block', opacity: 0.8 }}>
                            No data provided
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                            Skills
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.5rem', display: 'block', opacity: 0.8 }}>
                            No skills provided
                          </Typography>
                        </Box>
                      </Box>

                      {/* Main Content Section */}
                      <Box sx={{ flex: 1, p: 1 }}>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', display: 'block' }}>
                            <strong>Email:</strong>
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.55rem', display: 'block', color: 'text.secondary' }}>
                            john@example.com
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', display: 'block' }}>
                            <strong>Phone:</strong>
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.55rem', display: 'block', color: 'text.secondary' }}>
                            1234567890
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', display: 'block' }}>
                            <strong>Address:</strong>
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.55rem', display: 'block', color: 'text.secondary' }}>
                            123 Main St, City, State - 123456
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 1.5 }}>
                          <Typography variant="caption" sx={{ color: TEMPLATE_THEMES[template.id].primary, fontWeight: 'bold', fontSize: '0.7rem' }}>
                            Social Profiles
                          </Typography>
                          <Box sx={{ height: 1, bgcolor: TEMPLATE_THEMES[template.id].divider, mb: 0.5 }} />
                          <Typography variant="caption" sx={{ fontSize: '0.55rem', color: 'text.secondary', display: 'block' }}>
                            No social profile provided
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    // Regular Layout Preview (Modern, Classic, Creative)
                    <>
                      {/* Mini Header */}
                      <Box sx={{ borderBottom: 2, borderColor: TEMPLATE_THEMES[template.id].primary, pb: 1, mb: 1.5 }}>
                        <Typography variant="h6" sx={{ color: TEMPLATE_THEMES[template.id].primary, fontSize: '1.1rem', fontWeight: 'bold' }}>
                          John Doe
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          A brief intro goes here.
                        </Typography>
                      </Box>
                      
                      {/* Mini Contact Info */}
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block' }}>
                          <strong>Email:</strong> john@example.com
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block' }}>
                          <strong>Phone:</strong> 1234567890
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block' }}>
                          <strong>Address:</strong> 123 Main St, City, State - 123456
                        </Typography>
                      </Box>

                      {/* Mini Sections */}
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" sx={{ color: TEMPLATE_THEMES[template.id].primary, fontWeight: 'bold', fontSize: '0.75rem' }}>
                          Education
                        </Typography>
                        <Box sx={{ height: 1, bgcolor: TEMPLATE_THEMES[template.id].primary, mb: 0.5 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', display: 'block' }}>
                          No data provided
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" sx={{ color: TEMPLATE_THEMES[template.id].primary, fontWeight: 'bold', fontSize: '0.75rem' }}>
                          Experience
                        </Typography>
                        <Box sx={{ height: 1, bgcolor: TEMPLATE_THEMES[template.id].primary, mb: 0.5 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', display: 'block' }}>
                          No data available
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" sx={{ color: TEMPLATE_THEMES[template.id].primary, fontWeight: 'bold', fontSize: '0.75rem' }}>
                          Projects
                        </Typography>
                        <Box sx={{ height: 1, bgcolor: TEMPLATE_THEMES[template.id].primary, mb: 0.5 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', display: 'block' }}>
                          No data available
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: TEMPLATE_THEMES[template.id].primary, fontWeight: 'bold', fontSize: '0.75rem' }}>
                          Skills
                        </Typography>
                        <Box sx={{ height: 1, bgcolor: TEMPLATE_THEMES[template.id].primary, mb: 0.5 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', display: 'block' }}>
                          No data available
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>

              {/* Template Name Label */}
              <Box 
                sx={{ 
                  p: 1.5, 
                  bgcolor: selectedTemplate === template.id ? TEMPLATE_THEMES[template.id].primary : 'white',
                  color: selectedTemplate === template.id ? 'white' : 'text.primary',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {template.name}
                </Typography>
                {selectedTemplate === template.id && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    ✓ Selected
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* Resume Preview */}
      <Paper sx={{ p: 4 }} elevation={3} id="resume-print">
        <Box sx={{border: '1px solid #ddd', p: 3, borderRadius: 2, maxWidth: 900, mx: 'auto' }}>
          {/* Header with Profile Photo */}
          <Box
            sx={{
              borderBottom: 3,
              borderColor: theme.divider,
              pb: 2,
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{ color: theme.primary }}
              >
                {data.personalInfo?.fullName || 'Your Name'}
              </Typography>
              {data.personalInfo?.jobTitle && (
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  {data.personalInfo.jobTitle}
                </Typography>
              )}
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ color: 'text.secondary' }}>
                {data.personalInfo?.email && (
                  <Typography variant="body2">{data.personalInfo.email}</Typography>
                )}
                {data.personalInfo?.phone && (
                  <Typography variant="body2">• {data.personalInfo.phone}</Typography>
                )}
                {data.personalInfo?.address && (
                  <Typography variant="body2">• {data.personalInfo.address}</Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
                {data.personalInfo?.linkedin && (
                  <Typography variant="body2" color="text.secondary">
                    🔗 LinkedIn
                  </Typography>
                )}
                {data.personalInfo?.github && (
                  <Typography variant="body2" color="text.secondary">
                    💻 GitHub
                  </Typography>
                )}
                {data.personalInfo?.portfolio && (
                  <Typography variant="body2" color="text.secondary">
                    🌐 Portfolio
                  </Typography>
                )}
              </Stack>
            </Box>
            
            {/* Profile Photo */}
            {data.personalInfo?.profilePhoto && (
              <Avatar
                src={data.personalInfo.profilePhoto}
                alt={data.personalInfo?.fullName || 'Profile'}
                sx={{
                  width: 120,
                  height: 120,
                  border: `3px solid ${theme.primary}`,
                  flexShrink: 0,
                }}
                onError={(e) => {
                  console.error('Failed to load profile photo:', data.personalInfo.profilePhoto);
                  e.target.style.display = 'none';
                }}
              />
            )}
          </Box>

          {/* Summary */}
          {data.personalInfo?.summary && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: theme.primary, mb: 1 }}
              >
                Professional Summary
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {data.personalInfo.summary}
              </Typography>
            </Box>
          )}

          {/* Experience */}
          {data.experience?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold"  sx={{ color: theme.primary, mb: 1 }}>
                Experience
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Stack spacing={2}>
                {data.experience.map((exp) => (
                  <Box key={exp.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {exp.position}
                        </Typography>
                        <Typography variant="body1"   sx={{ color: theme.secondary }}>
                          {exp.company}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </Typography>
                    </Box>
                    {exp.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {exp.description}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Education */}
          {data.education?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: theme.primary, mb: 1 }}>
                Education
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Stack spacing={2}>
                {data.education.map((edu) => (
                  <Box key={edu.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {edu.degree}
                        </Typography>
                        <Typography variant="body1" sx={{ color: theme.secondary }}>
                          {edu.school}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(edu.graduationDate)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Skills */}
          {data.skills?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: theme.primary, mb: 1 }}>
                Skills
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {data.skills.map((skill) => (
                  <Chip
                    key={skill.id}
                    label={`${skill.name} (${skill.level}/5)`}
                    color={theme.chip}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Projects */}
          {data.projects?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: theme.primary, mb: 1 }}>
                Projects
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Stack spacing={2}>
                {data.projects.map((project) => (
                  <Box key={project.id}>
                    <Typography variant="h6" fontWeight="bold">
                      {project.name}
                    </Typography>
                    {project.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {project.description}
                      </Typography>
                    )}
                    {project.technologies && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        <strong>Technologies:</strong> {project.technologies}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Certifications */}
          {data.certifications?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: theme.primary, mb: 1 }}>
                Certifications
              </Typography>
              <Divider sx={{ mb: 2, borderColor: theme.divider }} />
              <Stack spacing={2}>
                {data.certifications.map((cert) => (
                  <Box key={cert.id}>
                    <Typography variant="h6" fontWeight="bold">
                      {cert.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cert.issuer} • {formatDate(cert.date)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PreviewStep;