
import { useState, useEffect } from 'react';
import { Copy, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/Spinner';

interface FileItem {
  id: string;
  name: string;
  size: number;
  created_at: string;
  download_count: number;
  unique_id: string;
  file_path: string; // Added file_path to the interface
}

export const FilesList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user's uploaded files
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setFiles(data || []);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      setError(err.message || 'Failed to load files');
      toast({
        title: "Error",
        description: "Failed to load your files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user, toast]);

  const handleCopyLink = (uniqueId: string) => {
    const shortUrl = `${window.location.origin}/d/${uniqueId}`;
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Link copied",
      description: "The file link has been copied to your clipboard",
    });
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!user) return;

    try {
      console.log("Deleting file with id:", id);
      console.log("File path to delete:", filePath);
      
      // First delete from storage if we have the path
      if (filePath) {
        console.log("Attempting to delete from storage:", filePath);
        const { error: storageError } = await supabase.storage
          .from('file_uploads')
          .remove([filePath]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
          throw storageError;
        }
        console.log("Successfully deleted from storage");
      }

      // Then delete from database
      console.log("Attempting to delete from database");
      const { error: deleteError } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Database deletion error:', deleteError);
        throw deleteError;
      }
      console.log("Successfully deleted from database");

      // Update UI
      setFiles(files.filter(file => file.id !== id));
      
      toast({
        title: "File deleted",
        description: "The file has been permanently deleted",
      });
    } catch (err: any) {
      console.error('Error deleting file:', err);
      toast({
        title: "Delete failed",
        description: err.message || "Failed to delete the file",
        variant: "destructive",
      });
    }
  };

  const handleView = (uniqueId: string) => {
    // Open the download page in a new tab
    window.open(`/d/${uniqueId}`, '_blank');
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">You haven't uploaded any files yet.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{formatDate(file.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{file.download_count}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleCopyLink(file.unique_id)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy link</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleView(file.unique_id)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View file</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(file.id, file.file_path)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete file</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
