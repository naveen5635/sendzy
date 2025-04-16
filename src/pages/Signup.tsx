
import { SignupForm } from '@/components/Auth/SignupForm';
import { Header } from '@/components/Layout/Header';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
