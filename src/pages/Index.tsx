
import { ArrowRight, Cloud, Lock, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Simple, secure file sharing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Upload your files and share them with anyone using a simple link. No technical knowledge required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-brand-lightPurple p-4 rounded-full mb-4">
                  <Cloud className="h-8 w-8 text-brand-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload your file</h3>
                <p className="text-gray-600">
                  Drag and drop or select any file to upload to our secure cloud storage.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-brand-lightPurple p-4 rounded-full mb-4">
                  <Share className="h-8 w-8 text-brand-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share the link</h3>
                <p className="text-gray-600">
                  Get a unique link that you can share with anyone who needs to access your file.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-brand-lightPurple p-4 rounded-full mb-4">
                  <Lock className="h-8 w-8 text-brand-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure download</h3>
                <p className="text-gray-600">
                  Recipients can download your file directly without creating an account.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">
              Ready to start sharing files?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create an account and start sharing your files in seconds.
            </p>
            <Link to="/signup">
              <Button size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-4 border-t">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          <p>© 2025 FileShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
