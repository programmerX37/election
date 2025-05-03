
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="w-full py-4 border-b bg-white">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="p-1"
          >
            <Menu className="h-5 w-5" />
          </Button>
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
