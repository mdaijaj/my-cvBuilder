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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Download,
  Lock,
  QrCode2,
  CreditCard,
  AccountBalance,
  CheckCircle,
} from '@mui/icons-material';

const PreviewStep = ({ data, selectedTemplate, onTemplateChange, readOnly = false }) => {
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'

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

  // Payment method configurations
  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI / QR Code',
      icon: QrCode2,
      description: 'Google Pay, PhonePe, Paytm, BHIM UPI',
      recommended: true,
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay, Amex',
      recommended: false,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: AccountBalance,
      description: 'All major banks supported',
      recommended: false,
    },
  ];

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

  const markAsSaved = () => {
    setHasUnsavedChanges(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

 const handlePayment = async () => {
  setIsProcessing(true);
  
  const res = await initializeRazorpay();
  if (!res) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    setIsProcessing(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 19 }), 
    });

    const orderData = await response.json();
    console.log('Order Data:', orderData);
    
    if (!orderData) {
      throw new Error('Failed to create order');
    }

    // FIXED: Simplified and corrected Razorpay config
    const options = {
      key: orderData.key || 'rzp_test_Rwsplfx5C62L66',
      amount: orderData.amount,
      currency: 'INR',
      name: 'Resume Builder',
      description: 'Download Premium Resume PDF',
      order_id: orderData.orderId,
      
      // Enable all payment methods
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
      
      // Simplified config for UPI priority
      config: {
        display: {
          blocks: {
            upi: {
              name: 'Pay using UPI',
              instruments: [{ method: 'upi' }]
            },
            other: {
              name: 'Other Payment Methods',
              instruments: [
                { method: 'card' },
                { method: 'netbanking' },
                { method: 'wallet' }
              ]
            }
          },
          sequence: paymentMethod === 'upi' 
            ? ['block.upi', 'block.other']
            : ['block.other', 'block.upi'],
          preferences: {
            show_default_blocks: true
          }
        }
      },

      handler: function (response) {
        console.log('Payment successful:', response);
        setIsPaid(true);
        setPaymentDialog(false);
        setIsProcessing(false);
        verifyPayment(response);
        generatePDF();
      },
      
      prefill: {
        name: data.personalInfo?.fullName || '',
        email: data.personalInfo?.email || '',
        contact: data.personalInfo?.phone || '',
      },
      
      theme: { color: '#1976d2' },
      
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        },
        confirm_close: true,
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    
  } catch (error) {
    console.error('Payment error:', error);
    alert('Failed to initialize payment. Please try again.');
    setIsProcessing(false);
  }
};

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
      markAsSaved();

      noPrintElements.forEach(el => {
        el.style.display = '';
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

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
          {isPaid ? 'Download PDF' : 'Pay ₹19 & Download'}  {/* Changed here */}
        </Button>
      </Box>

      {/* Enhanced Payment Dialog with UPI Selection */}
      <Dialog 
        open={paymentDialog} 
        onClose={() => !isProcessing && setPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lock color="primary" />
            <Typography variant="h6">Complete Payment to Download</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" paragraph>
            Download your professionally formatted resume as PDF for just ₹19
          </Typography>
          
          {/* Price Display */}
          <Box sx={{ 
            bgcolor: 'primary.lighter', 
            p: 3, 
            borderRadius: 2, 
            mb: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
              ₹19  {/* Changed from ₹9 */}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              One-time payment • Instant download
            </Typography>
          </Box>

          {/* Payment Method Selection */}
          <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
            <FormLabel 
              component="legend" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold', 
                fontSize: '1rem',
                color: 'text.primary',
              }}
            >
              Choose Payment Method
            </FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Card
                    key={method.id}
                    variant="outlined"
                    sx={{
                      mb: 1.5,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: paymentMethod === method.id ? 'primary.main' : 'grey.300',
                      bgcolor: paymentMethod === method.id ? 'primary.lighter' : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'grey.50',
                        borderColor: 'primary.light',
                      },
                    }}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <FormControlLabel
                        value={method.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1, width: '100%' }}>
                            <IconComponent 
                              sx={{ 
                                fontSize: 32, 
                                color: paymentMethod === method.id ? 'primary.main' : 'action.active' 
                              }} 
                            />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" fontWeight="bold">
                                  {method.name}
                                </Typography>
                                {method.recommended && (
                                  <Chip 
                                    label="Recommended" 
                                    size="small" 
                                    color="success" 
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                  />
                                )}
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {method.description}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </RadioGroup>
          </FormControl>

          {/* Benefits Alert */}
          <Alert 
            severity="info" 
            icon={<CheckCircle />}
            sx={{ mb: 2 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              ✓ Scan QR code with any UPI app
              <br />
              ✓ 100% secure payment via Razorpay
              <br />
              ✓ Instant download after payment
              <br />
              ✓ High-quality PDF format
            </Typography>
          </Alert>

          {/* UPI Apps Info (when UPI is selected) */}
          {paymentMethod === 'upi' && (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.50',
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" fontWeight="bold" display="block" mb={1}>
                Supported UPI Apps:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'].map((app) => (
                  <Chip 
                    key={app}
                    label={app} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
              </Stack>
            </Paper>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setPaymentDialog(false)} 
            disabled={isProcessing}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
            size="large"
            sx={{ minWidth: 180 }}
          >
            {isProcessing ? 'Processing...' : 'Proceed to Pay ₹19'}
          </Button>
        </DialogActions>
      </Dialog>

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
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: 320 }}>
                <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, height: '100%' }}>
                  <Box sx={{ borderBottom: 2, borderColor: TEMPLATE_THEMES[template.id].primary, pb: 1, mb: 1.5 }}>
                    <Typography variant="h6" sx={{ color: TEMPLATE_THEMES[template.id].primary, fontSize: '1.1rem', fontWeight: 'bold' }}>
                      John Doe
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Software Engineer
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block' }}>
                      <strong>Email:</strong> john@example.com
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block' }}>
                      <strong>Phone:</strong> 1234567890
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ color: TEMPLATE_THEMES[template.id].primary, fontWeight: 'bold', fontSize: '0.75rem' }}>
                      Skills
                    </Typography>
                    <Box sx={{ height: 1, bgcolor: TEMPLATE_THEMES[template.id].primary, mb: 0.5 }} />
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
                      React • Node.js • Python
                    </Typography>
                  </Box>
                </Box>
              </Box>

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