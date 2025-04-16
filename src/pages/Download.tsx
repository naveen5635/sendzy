
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download as DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Layout/Header';
import { Spinner } from '@/components/Spinner';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FileDetails {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
}

const Download = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<FileDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFileDetails = async () => {
      if (!fileId) {
        setError("File not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Get file information from database
        const { data: fileData, error: fileError } = await supabase
          .from('files')
          .select('*')
          .eq('unique_id', fileId)
          .single();

        if (fileError || !fileData) {
          throw new Error("File not found");
        }

        setFile({
          id: fileData.unique_id,
          name: fileData.name,
          size: fileData.size,
          type: fileData.mime_type,
          path: fileData.file_path
        });

        // Update download count
        await supabase
          .from('files')
          .update({ download_count: fileData.download_count + 1 })
          .eq('id', fileData.id);

      } catch (err: any) {
        console.error('Error fetching file:', err);
        setError(err.message || "Failed to load file information");
        toast({
          title: "Error",
          description: "Could not load file information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [fileId, toast]);

  const handleDownload = async () => {
    if (!file) return;
    
    try {
      toast({
        title: "Download started",
        description: "Your file download has begun.",
      });

      // Get signed URL for file download
      const { data, error } = await supabase.storage
        .from('file_uploads')
        .download(file.path);
      
      if (error || !data) {
        throw error;
      }

      // Create download URL
      const downloadUrl = URL.createObjectURL(data);
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
      
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full animate-fade-in">
          {loading ? (
            <div className="flex flex-col items-center py-10">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Loading file information...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="bg-brand-lightPurple p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <DownloadIcon className="h-8 w-8 text-brand-purple" />
                </div>
                <h1 className="text-2xl font-bold">Ready to download</h1>
                <p className="text-gray-600 mt-1">The file is ready to be downloaded</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">File name:</span>
                  <span className="font-medium">{file?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span>{formatFileSize(file?.size || 0)}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleDownload} 
                className="w-full flex items-center justify-center"
                size="lg"
              >
                <DownloadIcon className="h-5 w-5 mr-2" />
                Download File
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Download;
