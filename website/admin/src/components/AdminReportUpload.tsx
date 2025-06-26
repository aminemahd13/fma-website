'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, FileIcon, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { uploadFileWithSignedUrl, adminUpdateApplication } from '../api/ApplicationApi';

interface AdminReportUploadProps {
  applicationId: number;
  currentReportUrl?: string;
  onFileUpdated?: () => void;
}

export default function AdminReportUpload({
  applicationId,
  currentReportUrl,
  onFileUpdated
}: AdminReportUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (15MB limit)
      const maxSize = 15 * 1024 * 1024; // 15MB in bytes
      if (file.size > maxSize) {
        setUploadStatus('error');
        setStatusMessage('File size must be less than 15MB');
        return;
      }
      
      // Validate file type for reports (PDF, images)
      const acceptedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!acceptedTypes.includes(file.type)) {
        setUploadStatus('error');
        setStatusMessage('Invalid file type. Please select a PDF or image file.');
        return;
      }
      
      setSelectedFile(file);
      setUploadStatus('idle');
      setStatusMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus('idle');
    setStatusMessage('Uploading new report file...');

    try {
      // Upload file and get the file path
      const filePath = await uploadFileWithSignedUrl(selectedFile);
      
      // Update the application with the new report URL
      const updateData = { reportUrl: filePath };
      await adminUpdateApplication(applicationId, updateData);
        setUploadStatus('success');
      setStatusMessage(currentReportUrl 
        ? 'Report file uploaded and updated successfully! The page will refresh in 2 seconds.'
        : 'Report file uploaded successfully! The page will refresh in 2 seconds.'
      );
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('admin-report-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Notify parent component and refresh after a delay
      setTimeout(() => {
        if (onFileUpdated) {
          onFileUpdated();
        }
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Report upload failed:', error);
      setUploadStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  return (
    <Card className={`w-full ${currentReportUrl ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${currentReportUrl ? 'text-orange-800' : 'text-blue-800'}`}>
          <FileText className="h-5 w-5" />
          {currentReportUrl ? 'Admin: Replace Report File' : 'Admin: Upload Report File'}
        </CardTitle>
        <CardDescription className={currentReportUrl ? 'text-orange-700' : 'text-blue-700'}>
          {currentReportUrl 
            ? 'Upload a new report file to replace the current one. This action will overwrite the existing report.'
            : 'Upload a report file for this application. The user has not submitted a report yet.'
          }
          {currentReportUrl && (
            <span className="block mt-1 text-xs text-orange-600">
              Current report: {currentReportUrl.split('/').pop()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-report-file" className={currentReportUrl ? 'text-orange-800' : 'text-blue-800'}>
            {currentReportUrl ? 'Select New Report File' : 'Select Report File'}
          </Label>
          <Input
            id="admin-report-file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            disabled={uploading}
            className={`cursor-pointer ${currentReportUrl ? 'border-orange-300 focus:border-orange-500' : 'border-blue-300 focus:border-blue-500'}`}
          />
          <p className={`text-xs ${currentReportUrl ? 'text-orange-600' : 'text-blue-600'}`}>
            Accepted formats: PDF, PNG, JPG, JPEG • Max size: 15MB
          </p>
        </div>

        {selectedFile && (
          <div className={`flex items-center justify-between p-3 border rounded-lg ${currentReportUrl ? 'bg-orange-100 border-orange-300' : 'bg-blue-100 border-blue-300'}`}>
            <div className="flex items-center gap-2">
              <FileIcon className={`h-4 w-4 ${currentReportUrl ? 'text-orange-700' : 'text-blue-700'}`} />
              <div>
                <p className={`text-sm font-medium ${currentReportUrl ? 'text-orange-800' : 'text-blue-800'}`}>{selectedFile.name}</p>
                <p className={`text-xs ${currentReportUrl ? 'text-orange-600' : 'text-blue-600'}`}>
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              size="sm"
              className={currentReportUrl ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
            >
              {uploading ? 'Uploading...' : (currentReportUrl ? 'Upload & Replace' : 'Upload Report')}
            </Button>
          </div>
        )}

        {statusMessage && (
          <Alert className={
            uploadStatus === 'error' 
              ? 'border-red-300 bg-red-50' 
              : uploadStatus === 'success' 
                ? 'border-green-300 bg-green-50' 
                : 'border-blue-300 bg-blue-50'
          }>
            {uploadStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {uploadStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
            <AlertDescription className={
              uploadStatus === 'success' 
                ? 'text-green-700' 
                : uploadStatus === 'error' 
                  ? 'text-red-700' 
                  : 'text-blue-700'
            }>
              {statusMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className={`text-xs p-2 rounded border ${currentReportUrl ? 'text-orange-600 bg-orange-100 border-orange-200' : 'text-blue-600 bg-blue-100 border-blue-200'}`}>
          <strong>⚠️ Admin Notice:</strong> {currentReportUrl 
            ? 'This will permanently replace the user\'s report file. Make sure you have the correct file before uploading.'
            : 'You are uploading a report file on behalf of the user. This will be visible to the user in their profile.'
          }
        </div>
      </CardContent>
    </Card>
  );
}
