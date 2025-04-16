
import { FileUpload } from '@/components/FileUpload/FileUpload';
import { Header } from '@/components/Layout/Header';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Get display name safely from user metadata if available
  const displayName = user?.user_metadata?.name || '';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome back{displayName ? `, ${displayName}` : ''}! Upload a file to generate a sharing link.
        </p>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upload File</h2>
          <FileUpload />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
