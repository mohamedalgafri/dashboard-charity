// hooks/useUpload.ts
import { useState } from 'react';

interface UploadResponse {
  url: string;
  publicId: string;
}

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadResponse | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل في رفع الملف');
      }

      return {
        url: data.secure_url,
        publicId: data.public_id
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء رفع الملف';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    error,
  };
};