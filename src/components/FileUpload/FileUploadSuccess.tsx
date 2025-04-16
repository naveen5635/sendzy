
import { useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadedFile } from './FileUpload';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadSuccessProps {
  file: UploadedFile;
  onReset: () => void;
}

export const FileUploadSuccess = ({ file, onReset }: FileUploadSuccessProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(file.url);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "The download link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please select and copy the link manually.",
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
    <div className="bg-white rounded-lg p-8 shadow-md animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-green-600" />
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-center mb-2">
        File uploaded successfully!
      </h3>
      
      <p className="text-sm text-gray-500 text-center mb-4">
        Share this link with anyone to let them download your file
      </p>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium">File:</span>
          <span className="text-sm ml-1 text-gray-700">{file.name} ({formatFileSize(file.size)})</span>
        </div>
        
        <div className="flex">
          <input
            type="text"
            value={file.url}
            readOnly
            className="copy-link-input flex-grow"
          />
          <Button
            onClick={handleCopyLink}
            className="ml-2"
            variant="outline"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={onReset}
          className="text-brand-purple border-brand-purple hover:bg-brand-lightPurple flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> 
          Upload another file
        </Button>
      </div>
    </div>
  );
};
