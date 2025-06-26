'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, FileIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFileWithSignedUrl, adminUpdateApplication } from '../api/ApplicationApi';

interface AdminFileUploadProps {
  applicationId: number;
  currentFileUrl?: string;
  onFileUpdated?: (newFileUrl: string) => void;
  fieldName: string;
  displayName: string;
  acceptedFileTypes?: string;
}

export default function AdminFileUpload({
  applicationId,
  currentFileUrl,
  onFileUpdated,
  fieldName,
  displayName,
  acceptedFileTypes = '.pdf,.doc,.docx,.png,.jpg,.jpeg'
}: AdminFileUploadProps) {
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
      
      setSelectedFile(file);
      setUploadStatus('idle');
      setStatusMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus('idle');
    setStatusMessage('Uploading file...');

    try {
      // Upload file and get the file path
      const filePath = await uploadFileWithSignedUrl(selectedFile);
      
      // Update the application with the new file URL
      const updateData = { [fieldName]: filePath };
      await adminUpdateApplication(applicationId, updateData);
      
      setUploadStatus('success');
      setStatusMessage('File uploaded and updated successfully!');
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById(`file-${fieldName}`) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Notify parent component
      if (onFileUpdated) {
        onFileUpdated(filePath);
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Replace {displayName}
        </CardTitle>
        <CardDescription>
          Upload a new file to replace the current {displayName.toLowerCase()}
          {currentFileUrl && (
            <span className="block mt-1 text-xs text-muted-foreground">
              Current file: {currentFileUrl.split('/').pop()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`file-${fieldName}`}>Select New File</Label>
          <Input
            id={`file-${fieldName}`}
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileSelect}
            disabled={uploading}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Accepted formats: {acceptedFileTypes.replace(/\./g, '').toUpperCase()} • Max size: 15MB
          </p>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <FileIcon className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              size="sm"
            >
              {uploading ? 'Uploading...' : 'Upload & Replace'}
            </Button>
          </div>
        )}

        {statusMessage && (
          <Alert className={uploadStatus === 'error' ? 'border-destructive' : uploadStatus === 'success' ? 'border-green-500' : ''}>
            {uploadStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {uploadStatus === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
            <AlertDescription className={uploadStatus === 'success' ? 'text-green-700' : uploadStatus === 'error' ? 'text-destructive' : ''}>
              {statusMessage}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
