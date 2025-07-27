import axios from 'axios';

const API_URL = 'http://<YOUR-BACKEND-IP>:8000/analyze';

export const analyzeContract = async (file: any) => {
  const formData = new FormData();

  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || 'application/pdf',
  } as any);

  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
