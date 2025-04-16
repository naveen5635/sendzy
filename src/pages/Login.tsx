
import { LoginForm } from '@/components/Auth/LoginForm';
import { Header } from '@/components/Layout/Header';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
