
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full py-4 border-b bg-white">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 
            className="text-xl font-heading font-semibold text-election-secondary cursor-pointer" 
            onClick={() => navigate('/')}
          >
            Election Dashboard
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
