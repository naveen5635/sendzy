import { useState, useRef } from 'react';
import { FileUploadDropzone } from './FileUploadDropzone';
import { FileUploadProgress } from './FileUploadProgress';
import { FileUploadSuccess } from './FileUploadSuccess';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

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
  const { user } = useAuth();

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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to upload files.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique ID for file
      const uniqueId = uuidv4();
      
      // File path in supabase storage: userId/uniqueId/filename
      const filePath = `${user.id}/${uniqueId}/${file.name}`;
      
      // Upload file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('file_uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('file_uploads')
        .getPublicUrl(filePath);

      // Insert record in files table
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: user.id,
          name: file.name,
          size: file.size,
          mime_type: file.type,
          file_path: filePath,
          unique_id: uniqueId
        });

      if (dbError) {
        throw dbError;
      }

      // Create the download URL
      const fileUrl = `${window.location.origin}/download/${uniqueId}`;
      
      setUploadedFile({
        id: uniqueId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
      });
      
      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded and is ready to share.",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
