
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download as DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Layout/Header';
import { Spinner } from '@/components/Spinner';
import { useToast } from '@/components/ui/use-toast';

interface FileDetails {
  id: string;
  name: string;
  size: number;
  type: string;
}

const Download = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<FileDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch file details
    const fetchFileDetails = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, this would be fetched from the backend
        if (fileId) {
          // Mock file data for demonstration
          const mockFile = {
            id: fileId,
            name: "example-document.pdf",
            size: 2500000, // 2.5 MB
            type: "application/pdf",
          };
          
          setFile(mockFile);
        } else {
          setError("File not found");
        }
      } catch (err) {
        setError("Failed to load file information");
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

  const handleDownload = () => {
    // In a real app, this would trigger the actual file download
    // For this demo, show a success toast
    toast({
      title: "Download started",
      description: "Your file download has begun.",
    });
    
    // Simulate download by creating a fake download
    const link = document.createElement('a');
    link.href = `#${fileId}`;
    link.download = file?.name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
