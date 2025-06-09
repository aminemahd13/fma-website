import ApiMethods from "./ApiMethods";
import { getSignedURL, uploadFile } from "./MediaApi";

export const postApplication = (application: any) => {
  const url = 'applications';
  const body = {...application};
  return ApiMethods.post(url, body);
}

export const getAllApplications = () => {
  const url = 'applications';
  return ApiMethods.get(url);
}

export const getApplicationById = (id: number) => {
  const url = 'applications';
  return ApiMethods.get(url);
}

export const putApplication = (id: number, partialApplication: any) => {
  const url = `applications/${id}`;
  const body = {...partialApplication};
  return ApiMethods.put(url, body);
}

export const putApplicationStatus = (id: number, partialApplicationStatus: any) => {
  const url = `applications/status/${id}`;
  const body = {...partialApplicationStatus};
  return ApiMethods.put(url, body);
}

export const deleteApplication = (id: number) => {
  const url = `applications/${id}`;
  return ApiMethods.delete(url);
}

export const adminUpdateApplication = (id: number, partialApplication: any) => {
  const url = `applications/admin/${id}`;
  const body = {...partialApplication};
  return ApiMethods.put(url, body);
}

// Utility function for uploading files with signed URL
export const uploadFileWithSignedUrl = async (file: File) => {
  try {
    // Calculate file checksum
    const checksum = await calculateChecksum(file);
    
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `upload_mtym/admin_reports/${timestamp}_${file.name}`;
    
    // Get signed URL
    const signedUrlResponse = await getSignedURL(fileName, file.type, file.size, checksum) as any;
    
    if (!signedUrlResponse?.url) {
      throw new Error('Failed to get signed URL');
    }
    
    // Upload file to S3
    await uploadFile(signedUrlResponse.url, file);
    
    // Return the file path for storage in database
    return fileName;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
}

// Simple checksum calculation
const calculateChecksum = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}