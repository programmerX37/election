import { useNavigate } from 'react-router-dom';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="w-full py-4 border-b bg-white dark:bg-background">
      <div className="container"></div>
    </header>
  );
};

export default Header;
