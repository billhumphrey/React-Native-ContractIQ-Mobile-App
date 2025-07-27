// services/api.ts
import * as FileSystem from 'expo-file-system';

export const analyzeContract = async (file: any): Promise<any> => {
  const uri = file.uri;
  const filename = file.name || uri.split('/').pop();
  const fileType = file.mimeType || 'application/octet-stream';

  const formData = new FormData();
  formData.append('file', {
    uri,
    name: filename,
    type: fileType,
  } as any);

const response = await fetch('http://192.168.100.42:8000/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  body: formData,
});


  if (!response.ok) {
    throw new Error('Failed to analyze contract');
  }

  const json = await response.json();
  return json.clauses; 
};
