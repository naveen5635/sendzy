
import { useState, useRef } from 'react';
import { FileUploadDropzone } from './FileUploadDropzone';
import { FileUploadProgress } from './FileUploadProgress';
import { FileUploadSuccess } from './FileUploadSuccess';
import { useToast } from '@/components/ui/use-toast';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate file upload with progress
    const totalSize = file.size;
    let uploaded = 0;
    
    const interval = setInterval(() => {
      uploaded += totalSize / 10;
      const progress = Math.min(Math.round((uploaded / totalSize) * 100), 100);
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // In a real implementation, this would return a URL from the server
        const fileId = `file-${Date.now()}`;
        const fileUrl = `${window.location.origin}/download/${fileId}`;
        
        // Mock successful upload after 100%
        setTimeout(() => {
          setUploading(false);
          setUploadedFile({
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            url: fileUrl,
          });
          
          toast({
            title: "File uploaded successfully",
            description: "Your file has been uploaded and is ready to share.",
          });
        }, 500);
      }
    }, 300);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!uploading && !uploadedFile && (
        <FileUploadDropzone
          isDragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onFileChange={handleFileChange}
          fileInputRef={fileInputRef}
        />
      )}

      {uploading && (
        <FileUploadProgress progress={uploadProgress} />
      )}

      {uploadedFile && (
        <FileUploadSuccess file={uploadedFile} onReset={handleReset} />
      )}
    </div>
  );
};
