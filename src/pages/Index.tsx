
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useElection } from '@/context/ElectionContext';
import { UserIcon, ShieldIcon, BarChart3, PlayIcon, PenIcon, RotateCcwIcon } from 'lucide-react';

const Index = () => {
  const { settings, voter, admin, updateSettings, startElection, resetElection } = useElection();
  const [electionName, setElectionName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate('/admin-dashboard');
    } else if (voter) {
      navigate('/voter-dashboard');
    }
  }, [admin, voter, navigate]);

  const handleChangeElectionName = () => {
    const finalElectionName = `${electionName.trim()} Election`.trim() || "Election";
    updateSettings({ election_name: finalElectionName });
    setIsEditingName(false);
    setElectionName('');
  };

  const handleStartElection = () => {
    const finalElectionName = `${electionName.trim()} Election`.trim() || "Election";
    updateSettings({ election_name: finalElectionName });
    startElection();
    setElectionName('');
    setIsStartDialogOpen(false);
  };

  const handleResetElection = () => {
    resetElection();
    setIsResetDialogOpen(false);
  };

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <section className="container py-12 md:py-24">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4">
              <h1 className="text-4xl md:text-5xl font-bold text-election-primary">
                {settings.election_name || "Election"}
              </h1>
              {!isEditingName && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsEditingName(true)}
                >
                  <PenIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
            {isEditingName && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Input
                  type="text"
                  placeholder="Enter the name of the Election"
                  value={electionName}
                  onChange={(e) => setElectionName(e.target.value)}
                  className="max-w-md"
                />
                <Button 
                  onClick={handleChangeElectionName}
                  disabled={!electionName.trim()}
                >
                  Save
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsEditingName(false);
                    setElectionName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              A secure and transparent platform for managing elections with real-time results.
            </p>
          </div>

          {settings.election_status === 'not_started' && (
            <div className="max-w-md mx-auto mb-12">
              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder="Enter election name"
                  value={electionName}
                  onChange={(e) => setElectionName(e.target.value)}
                  className="text-center"
                />
                <Button 
                  className="flex items-center justify-center gap-2"
                  disabled={!electionName.trim()}
                  onClick={() => setIsStartDialogOpen(true)}
                >
                  <PlayIcon className="w-4 h-4" />
                  Start Election
                </Button>
                
                <AlertDialog open={isStartDialogOpen} onOpenChange={setIsStartDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Start the Election?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will start the election with the name "{electionName.trim() ? `${electionName.trim()} Election` : "Election"}". 
                        Once started, voters will be able to cast their votes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleStartElection}>Start Election</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {(settings.election_status === 'ongoing' || settings.election_status === 'ended') && (
            <div className="max-w-md mx-auto mb-12">
              <Button 
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setIsResetDialogOpen(true)}
              >
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
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card 
              className="card-hover cursor-pointer" 
              onClick={() => handleCardClick('/admin-login')}
            >
              <CardHeader className="text-center">
                <ShieldIcon className="w-12 h-12 mx-auto text-election-primary mb-4" />
                <CardTitle>Admin Portal</CardTitle>
                <CardDescription>Manage candidates and voters</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                  Login to the admin panel to create candidates, manage voters, and control the election process.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pt-0">
                <Button 
                  className="w-full"
                >
                  Admin Login
                </Button>
              </CardFooter>
            </Card>

            <Card 
              className="card-hover cursor-pointer" 
              onClick={() => handleCardClick('/voter-login')}
            >
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
                <Button 
                  className="w-full"
                  disabled={settings.election_status !== 'ongoing'}
                >
                  Voter Login
                </Button>
              </CardFooter>
            </Card>

            <Card 
              className="card-hover cursor-pointer" 
              onClick={() => settings.results_visible && handleCardClick('/results')}
            >
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
                  className="w-full"
                  variant="outline"
                  disabled={!settings.results_visible}
                >
                  View Results
                </Button>
              </CardFooter>
            </Card>
          </div>

          {settings.previous_elections && settings.previous_elections.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center mb-6">Previous Elections</h2>
              <div className="grid gap-4 max-w-3xl mx-auto">
                {settings.previous_elections.map((election, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{election.name || "Unnamed Election"}</CardTitle>
                      <CardDescription>Completed on {new Date(election.end_date).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {election.winners && (
                        <div>
                          <p className="font-medium">Winner(s): {election.winners.join(', ')}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
