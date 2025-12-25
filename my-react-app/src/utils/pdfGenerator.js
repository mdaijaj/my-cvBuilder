import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (elementId, fileName = 'resume.pdf') => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

export default generatePDF;

import html2pdf from 'html2pdf.js';

const downloadResume = () => {
  const element = document.getElementById('resume-preview');

  html2pdf()
    .from(element)
    .set({
      margin: 10,
      filename: 'resume.pdf',
      html2canvas: { useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4' }
    })
    .save();
};
