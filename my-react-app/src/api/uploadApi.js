import axios from './axios';

export const uploadApi = {
  uploadImage: async (file) => {
    console.log('🔧 uploadApi called with file:', file.name);
    
    const formData = new FormData();
    formData.append('profileImage', file);
    
    console.log('📡 Sending POST request to /api/upload/profile');
    
    const apiRes = await axios.post('/api/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('📨 Raw API Response:', apiRes);
    console.log('📨 Response data:', apiRes.data);
    console.log('📨 Response URL field:', apiRes.data.url);
    const baseUrl="http://localhost:5000"
    
    // Check what base URL we're using
    // const baseUrl = import.meta.env.VITE_API_BASE_URL;
    console.log('🌐 Base URL from env:', baseUrl);
    
    // Construct full URL
    const fullUrl = `${baseUrl}${apiRes.data.url}`;
    console.log('🔗 Full constructed URL:', fullUrl);
    
    return {
      ...apiRes,
      data: {
        ...apiRes.data,
        url: fullUrl
      }
    };
  },
};