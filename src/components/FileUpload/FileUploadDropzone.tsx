
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadDropzoneProps {
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const FileUploadDropzone = ({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange,
  fileInputRef,
}: FileUploadDropzoneProps) => {
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`file-drop ${isDragging ? 'file-drop-active' : ''} flex flex-col items-center justify-center animate-fade-in`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Upload
        className="w-12 h-12 text-brand-purple mb-4"
        strokeWidth={1.5}
      />
      <h3 className="text-lg font-medium mb-2">
        Drag and drop your file here
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        or click to browse from your computer
      </p>
      <input
        type="file"
        className="hidden"
        onChange={onFileChange}
        ref={fileInputRef}
      />
      <Button onClick={handleButtonClick} variant="outline">
        Choose File
      </Button>
    </div>
  );
};
