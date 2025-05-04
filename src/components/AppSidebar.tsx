
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useElection } from '@/context/ElectionContext';
import { 
  Sidebar, 
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';
import { LayoutDashboard, Vote, Users, BarChart3, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, voter } = useElection();
  const { toggleSidebar } = useSidebar();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Vote className="h-8 w-8 text-election-primary mr-2" />
            <h1 className="text-2xl font-heading font-bold text-election-primary">GovVote</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/')}
                  onClick={() => navigate('/')}
                  tooltip="Dashboard"
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/admin-dashboard')}
                  onClick={() => navigate('/admin-dashboard')}
                  tooltip="Elections"
                >
                  <Vote />
                  <span>Elections</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/voter-login')}
                  onClick={() => navigate('/voter-login')}
                  tooltip="Voters"
                >
                  <Users />
                  <span>Voters</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/results')}
                  onClick={() => navigate('/results')}
                  tooltip="Results"
                >
                  <BarChart3 />
                  <span>Results</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Preferences</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-sidebar-accent cursor-pointer">
                  <div className="flex items-center gap-2">
                    {theme === 'light' ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                    <span className="text-sm">Theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
                  </div>
                  <Switch 
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex items-center px-2">
            <div className="flex flex-col">
              <span className="font-medium text-sm">Alex Morgan</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
