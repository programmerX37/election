
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useElection } from '@/context/ElectionContext';
import { UserIcon, ShieldIcon, BarChart3 } from 'lucide-react';
import { useEffect } from 'react';

const Index = () => {
  const { settings, voter, admin } = useElection();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (admin) {
      navigate('/admin-dashboard');
    } else if (voter) {
      navigate('/voter-dashboard');
    }
  }, [admin, voter, navigate]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <section className="container py-12 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-election-primary">
              Welcome to Election Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A secure and transparent platform for managing elections with real-time results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Admin Login Card */}
            <Card className="card-hover">
              <CardHeader className="text-center">
                <ShieldIcon className="w-12 h-12 mx-auto text-election-primary mb-4" />
                <CardTitle>Admin Access</CardTitle>
                <CardDescription>Manage candidates and voters</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                  Login to the admin panel to create candidates, manage voters, and control the election process.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pt-0">
                <Button 
                  onClick={() => handleNavigate('/admin-login')}
                  className="w-full"
                >
                  Admin Login
                </Button>
              </CardFooter>
            </Card>

            {/* Voter Login Card */}
            <Card className="card-hover">
              <CardHeader className="text-center">
                <UserIcon className="w-12 h-12 mx-auto text-election-secondary mb-4" />
                <CardTitle>Voter Access</CardTitle>
                <CardDescription>Cast your vote securely</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                  Log in with your voter credentials to cast your vote in the ongoing election.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pt-0">
                <Button 
                  onClick={() => handleNavigate('/voter-login')}
                  className="w-full"
                  disabled={settings.election_status !== 'ongoing'}
                >
                  Voter Login
                </Button>
              </CardFooter>
            </Card>

            {/* Results Card */}
            <Card className="card-hover">
              <CardHeader className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-election-accent mb-4" />
                <CardTitle>Election Results</CardTitle>
                <CardDescription>View the current standings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                  View the election results and statistics after the election has been completed.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pt-0">
                <Button 
                  onClick={() => handleNavigate('/results')}
                  className="w-full"
                  variant="outline"
                  disabled={!settings.results_visible}
                >
                  View Results
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-muted">
              <span className={`h-3 w-3 rounded-full ${
                settings.election_status === 'not_started' ? 'bg-muted-foreground animate-pulse-slow' : 
                settings.election_status === 'ongoing' ? 'bg-election-success animate-pulse-slow' : 
                'bg-election-secondary'
              }`}></span>
              <span className="text-sm font-medium">
                Election Status: {' '}
                {settings.election_status === 'not_started' ? 'Not Started' : 
                 settings.election_status === 'ongoing' ? 'Ongoing' : 
                 'Ended'}
              </span>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
