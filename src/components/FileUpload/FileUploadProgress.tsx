
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';

interface FileUploadProgressProps {
  progress: number;
}

export const FileUploadProgress = ({ progress }: FileUploadProgressProps) => {
  return (
    <div className="bg-white rounded-lg p-8 shadow-md animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        <Upload className="w-12 h-12 text-brand-purple" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium text-center mb-4">
        Uploading your file...
      </h3>
      <Progress value={progress} className="h-2 mb-2" />
      <p className="text-sm text-gray-500 text-center">{progress}% complete</p>
    </div>
  );
};
