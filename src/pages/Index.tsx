import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Footer from '@/components/Footer';
import { useElection } from '@/context/ElectionContext';
import { UserIcon, ShieldIcon, BarChart3, RotateCcwIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const {
    settings,
    voter,
    admin,
    updateSettings,
    resetElection
  } = useElection();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  
  useEffect(() => {
    if (admin) {
      navigate('/admin-dashboard');
    } else if (voter) {
      navigate('/voter-dashboard');
    }
    
    // Set default election name if none exists
    if (!settings.election_name) {
      updateSettings({
        election_name: "GovVote Election"
      });
    }
  }, [admin, voter, navigate, settings.election_name, updateSettings]);
  
  const handleResetElection = () => {
    resetElection();
    setIsResetDialogOpen(false);
    toast({
      title: "Election Reset",
      description: "The election has been reset to its initial state."
    });
  };
  
  const handleCardClick = (path: string) => {
    navigate(path);
  };
  
  return <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="container py-0 md:py-12">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
              GovVote
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              A secure and transparent platform for managing elections with real-time results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="card-hover cursor-pointer" onClick={() => handleCardClick('/admin-login')}>
              <CardHeader className="text-center">
                <ShieldIcon className="w-12 h-12 mx-auto bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-4" />
                <CardTitle>Admin Portal</CardTitle>
                <CardDescription>Manage candidates and voters</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                  Login to the admin panel to create candidates, manage voters, and control the election process.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pt-0">
                <Button className="w-full">
                  Admin Login
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover cursor-pointer" onClick={() => handleCardClick('/voter-login')}>
              <CardHeader className="text-center">
                <UserIcon className="w-12 h-12 mx-auto text-election-secondary mb-4" />
                <CardTitle>Voter Portal</CardTitle>
                <CardDescription>Cast your vote securely</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                  Log in with your voter credentials to cast your vote in the ongoing election.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pt-0">
                <Button disabled={settings.election_status !== 'ongoing'} className="w-full my-[20px]">
                  Voter Login
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover cursor-pointer" onClick={() => settings.results_visible && handleCardClick('/results')}>
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
                <Button className="w-full" variant="outline" disabled={!settings.results_visible}>
                  View Results
                </Button>
              </CardFooter>
            </Card>
          </div>

          {settings.previous_elections && settings.previous_elections.length > 0 && <div className="mt-16">
              <h2 className="text-2xl font-bold text-center mb-6">Previous Elections</h2>
              <div className="grid gap-4 max-w-3xl mx-auto">
                {settings.previous_elections.map((election, index) => <Card key={index} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{election.name || "Unnamed Election"}</CardTitle>
                      <CardDescription>Completed on {new Date(election.end_date).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {election.winners && <div>
                          <p className="font-medium">Winner(s): {election.winners.join(', ')}</p>
                        </div>}
                    </CardContent>
                  </Card>)}
              </div>
            </div>}

          {settings.election_status === 'ongoing' && <div className="mt-12 text-center">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => setIsResetDialogOpen(true)}>
              <RotateCcwIcon className="w-4 h-4" />
              Reset Election
            </Button>
            
            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset the Election?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset the election to its initial state. All votes will be cleared and the election will be set to "Not Started".
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetElection}>Reset Election</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>}

        </section>
      </main>
      
      <Footer />
    </div>;
};

export default Index;
