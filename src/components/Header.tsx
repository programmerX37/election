
import { useNavigate } from 'react-router-dom';
import { useElection } from '@/context/ElectionContext';
import { Button } from '@/components/ui/button';
import { VoteIcon, UserIcon, LogOut } from 'lucide-react';

const Header = () => {
  const { admin, voter, logoutAdmin, logoutVoter } = useElection();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (admin) {
      logoutAdmin();
    } else if (voter) {
      logoutVoter();
    }
    navigate('/');
  };

  return (
    <header className="w-full py-4 border-b bg-white">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <VoteIcon className="h-8 w-8 text-election-primary" />
          <h1 
            className="text-2xl font-bold text-election-primary cursor-pointer" 
            onClick={() => navigate('/')}
          >
            Election
          </h1>
        </div>

        <div>
          {(admin || voter) && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-election-primary" />
                <span className="font-medium">
                  {admin ? 'Admin' : voter?.usn}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
