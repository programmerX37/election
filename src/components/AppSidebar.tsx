
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
  SidebarSeparator
} from '@/components/ui/sidebar';
import { LayoutDashboard, Vote, Users, BarChart3, Settings, ClipboardList, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, voter, logoutAdmin, logoutVoter } = useElection();

  const handleLogout = () => {
    if (admin) {
      logoutAdmin();
    } else if (voter) {
      logoutVoter();
    }
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="flex items-center px-4 py-3">
          <Vote className="h-8 w-8 text-election-primary mr-2" />
          <h1 className="text-2xl font-heading font-bold text-election-primary">GovVote</h1>
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
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={false}
                  tooltip="Settings"
                >
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={false}
                  tooltip="Logs"
                >
                  <ClipboardList />
                  <span>Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center px-2">
              <div className="flex flex-col">
                <span className="font-medium text-sm">Alex Morgan</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout} 
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
