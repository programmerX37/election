import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CandidateCard from '@/components/CandidateCard';
import { useElection } from '@/context/ElectionContext';
import { CheckCircle2 } from 'lucide-react';

const VoterDashboard = () => {
  const { voter, candidates, settings, submitVote, logoutVoter } = useElection();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in as voter or election not ongoing
  useEffect(() => {
    if (!voter) {
      navigate('/voter-login');
    } else if (settings.election_status !== 'ongoing') {
      toast({
        title: "Election not active",
        description: "Voting is not currently available",
        variant: "destructive",
      });
      logoutVoter();
      navigate('/');
    } else if (voter.has_voted) {
      toast({
        title: "Already voted",
        description: "You have already cast your vote",
      });
      // Don't automatically logout and redirect when they've already voted
      // Let them view the thank you screen
    }
  }, [voter, settings.election_status, navigate, toast, logoutVoter]);

  const handleVoteSubmit = () => {
    if (selectedCandidate !== null) {
      submitVote(selectedCandidate);
      
      toast({
        title: "Vote submitted",
        description: "Your vote has been recorded successfully",
      });
      
      // Redirect to voter portal after successfully voting
      navigate('/');
    }
  };

  // If voter has already voted, show the thank you screen with dashboard
  if (voter?.has_voted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 container flex items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CheckCircle2 className="h-16 w-16 text-election-success mx-auto mb-4" />
              <CardTitle className="text-2xl">Thank You!</CardTitle>
              <CardDescription>Your vote has been recorded</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6">You are now viewing your voter dashboard.</p>
              <div className="flex flex-col space-y-4">
                {settings.results_visible && (
                  <Button onClick={() => navigate('/results')}>View Results</Button>
                )}
                <Button variant="outline" onClick={() => {
                  logoutVoter();
                  navigate('/');
                }}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Cast Your Vote</h1>
          <p className="text-muted-foreground">
            Select a candidate and confirm your choice
          </p>
        </div>
        
        <div className="mb-8">
          {candidates.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">No candidates available.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {candidates.map(candidate => (
                <div 
                  key={candidate.id} 
                  className={`relative ${selectedCandidate === candidate.id ? 'ring-2 ring-election-primary rounded-lg' : ''}`}
                  onClick={() => setSelectedCandidate(candidate.id)}
                >
                  <CandidateCard 
                    candidate={candidate}
                    onVote={() => setSelectedCandidate(candidate.id)}
                  />
                  {selectedCandidate === candidate.id && (
                    <div className="absolute top-2 right-2 h-6 w-6 bg-election-primary rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="lg"
                className="px-8"
                disabled={selectedCandidate === null}
              >
                Submit Vote
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cast your vote? This action cannot be undone.
                  {selectedCandidate !== null && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="font-medium">You are voting for:</p>
                      <p className="mt-1">
                        {candidates.find(c => c.id === selectedCandidate)?.name} -
                        {' '}
                        <span className="text-muted-foreground">
                          {candidates.find(c => c.id === selectedCandidate)?.party}
                        </span>
                      </p>
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleVoteSubmit}>
                  Confirm Vote
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VoterDashboard;
