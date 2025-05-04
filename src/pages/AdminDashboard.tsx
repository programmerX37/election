import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CandidateCard from '@/components/CandidateCard';
import { useElection } from '@/context/ElectionContext';
import { Candidate } from '@/lib/db';
import { 
  UserPlus, PlusCircle, Play, StopCircle, 
  UserCheck, Users, ListChecks, BarChart3, RotateCcw 
} from 'lucide-react';

const AdminDashboard = () => {
  const { 
    admin, 
    candidates, 
    voters, 
    settings,
    addCandidate, 
    updateCandidate,
    deleteCandidate,
    bulkAddVoters,
    startElection,
    endElection,
    resetElection
  } = useElection();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStartElectionDialogOpen, setIsStartElectionDialogOpen] = useState(false);
  const [isEndElectionDialogOpen, setIsEndElectionDialogOpen] = useState(false);
  const [isResetElectionDialogOpen, setIsResetElectionDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate('/admin-login');
    }
  }, [admin, navigate]);

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (candidates.length >= 5) {
        toast({
          title: "Limit reached",
          description: "Maximum of 5 candidates allowed",
          variant: "destructive",
        });
        return;
      }
      
      addCandidate({ name: candidateName, party: candidateParty });
      
      toast({
        title: "Success",
        description: "Candidate created successfully",
      });
      
      setCandidateName('');
      setCandidateParty('');
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create candidate",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCandidate) {
        updateCandidate(editingCandidate.id, { 
          name: candidateName, 
          party: candidateParty 
        });
        
        toast({
          title: "Success",
          description: "Candidate updated successfully",
        });
        
        setEditingCandidate(null);
        setCandidateName('');
        setCandidateParty('');
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update candidate",
        variant: "destructive",
      });
    }
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setCandidateName(candidate.name);
    setCandidateParty(candidate.party);
    setIsDialogOpen(true);
  };

  const handleDeleteCandidate = (id: number) => {
    try {
      deleteCandidate(id);
      
      toast({
        title: "Success",
        description: "Candidate deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete candidate",
        variant: "destructive",
      });
    }
  };

  const handleBulkAddVoters = () => {
    try {
      const remainingSlots = 69 - voters.length;
      
      if (remainingSlots <= 0) {
        toast({
          title: "Limit reached",
          description: "Maximum of 69 voters allowed",
          variant: "destructive",
        });
        return;
      }
      
      const addedVoters = bulkAddVoters(remainingSlots);
      
      toast({
        title: "Success",
        description: `${addedVoters.length} voters added successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add voters",
        variant: "destructive",
      });
    }
  };

  const handleStartElection = () => {
    if (candidates.length === 0) {
      toast({
        title: "Cannot start election",
        description: "Add at least one candidate first",
        variant: "destructive",
      });
      setIsStartElectionDialogOpen(false);
      return;
    }
    
    if (voters.length === 0) {
      toast({
        title: "Cannot start election",
        description: "Add voters first",
        variant: "destructive",
      });
      setIsStartElectionDialogOpen(false);
      return;
    }
    
    startElection();
    toast({
      title: "Election started",
      description: "Voters can now cast their votes",
    });
    setIsStartElectionDialogOpen(false);
  };

  const handleEndElection = () => {
    endElection();
    
    // Immediately update the local state to ensure UI reflects the changes
    setSettings({
      ...settings,
      election_status: 'ended',
      results_visible: true
    });
    
    toast({
      title: "Election ended",
      description: "Results are now available to view",
    });
    setIsEndElectionDialogOpen(false);
  };

  const handleResetElection = () => {
    resetElection();
    toast({
      title: "Election reset",
      description: "The election has been reset to its initial state",
    });
    setIsResetElectionDialogOpen(false);
  };

  const resetForm = () => {
    setEditingCandidate(null);
    setCandidateName('');
    setCandidateParty('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-election-primary">Admin Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className={`h-3 w-3 rounded-full ${
              settings.election_status === 'not_started' ? 'bg-muted-foreground' : 
              settings.election_status === 'ongoing' ? 'bg-election-success animate-pulse-slow' : 
              'bg-election-secondary'
            }`}></span>
            <span className="text-sm font-medium">
              {settings.election_status === 'not_started' ? 'Election Not Started' : 
              settings.election_status === 'ongoing' ? 'Election Ongoing' : 
              'Election Ended'}
            </span>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <ListChecks className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Candidates</span>
            </TabsTrigger>
            <TabsTrigger value="voters" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Voters</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Candidates</CardTitle>
                  <CardDescription>Total registered candidates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{candidates.length} / 5</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Voters</CardTitle>
                  <CardDescription>Total registered voters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{voters.length} / 69</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Votes Cast</CardTitle>
                  <CardDescription>Total number of votes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {voters.filter(v => v.has_voted).length} / {voters.length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Election Status</CardTitle>
                  <CardDescription>Current state of the election</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-medium">
                    {settings.election_status === 'not_started' ? 'Not Started' : 
                     settings.election_status === 'ongoing' ? 'Ongoing' : 
                     'Ended'}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Election Control</CardTitle>
                  <CardDescription>Start or end the current election</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settings.election_status === 'not_started' ? (
                    <>
                      <Button 
                        className="w-full flex items-center" 
                        disabled={settings.election_status !== 'not_started'}
                        onClick={() => setIsStartElectionDialogOpen(true)}
                      >
                        <Play className="h-4 w-4 mr-2" /> Start Election
                      </Button>
                      
                      <AlertDialog 
                        open={isStartElectionDialogOpen} 
                        onOpenChange={setIsStartElectionDialogOpen}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Start the Election?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will start the election and allow voters to cast their votes. 
                              You won't be able to add or edit candidates after starting.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleStartElection}>
                              Start Election
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : settings.election_status === 'ongoing' ? (
                    <>
                      <Button 
                        className="w-full flex items-center" 
                        variant="destructive"
                        disabled={settings.election_status !== 'ongoing'}
                        onClick={() => setIsEndElectionDialogOpen(true)}
                      >
                        <StopCircle className="h-4 w-4 mr-2" /> End Election
                      </Button>
                      
                      <AlertDialog 
                        open={isEndElectionDialogOpen} 
                        onOpenChange={setIsEndElectionDialogOpen}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>End the Election?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will end the election and prevent any more votes from being cast.
                              Results will be made public automatically.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleEndElection}>
                              End Election
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <Button disabled className="w-full">
                      Election Completed
                    </Button>
                  )}
                  
                  {settings.election_status === 'ended' && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/results')}
                    >
                      View Results
                    </Button>
                  )}
                  
                  {(settings.election_status === 'ongoing' || settings.election_status === 'ended') && (
                    <>
                      <Button 
                        variant="outline"
                        className="w-full flex items-center"
                        onClick={() => setIsResetElectionDialogOpen(true)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" /> Reset Election
                      </Button>
                      
                      <AlertDialog 
                        open={isResetElectionDialogOpen} 
                        onOpenChange={setIsResetElectionDialogOpen}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reset the Election?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will reset the election to its initial state. All votes will be cleared
                              and the election will be set to "Not Started". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetElection}>
                              Reset Election
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage candidates and voters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center" 
                        disabled={settings.election_status !== 'not_started' || candidates.length >= 5}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Candidate
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingCandidate ? 'Update candidate information' : 'Create a new candidate for the election'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={editingCandidate ? handleUpdateCandidate : handleCreateCandidate}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Candidate Name</Label>
                            <Input 
                              id="name" 
                              value={candidateName}
                              onChange={(e) => setCandidateName(e.target.value)}
                              placeholder="Enter candidate name"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="party">Party Name</Label>
                            <Input 
                              id="party" 
                              value={candidateParty}
                              onChange={(e) => setCandidateParty(e.target.value)}
                              placeholder="Enter party name"
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              resetForm();
                              setIsDialogOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingCandidate ? 'Update' : 'Create'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    className="w-full flex items-center" 
                    disabled={settings.election_status !== 'not_started' || voters.length >= 69}
                    onClick={handleBulkAddVoters}
                  >
                    <UserPlus className="h-4 w-4 mr-2" /> Generate Voter Accounts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="candidates" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Manage Candidates</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="flex items-center" 
                    disabled={settings.election_status !== 'not_started' || candidates.length >= 5}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Candidate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Candidate</DialogTitle>
                    <DialogDescription>Create a new candidate for the election</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCandidate}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Candidate Name</Label>
                        <Input 
                          id="name" 
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="Enter candidate name"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="party">Party Name</Label>
                        <Input 
                          id="party" 
                          value={candidateParty}
                          onChange={(e) => setCandidateParty(e.target.value)}
                          placeholder="Enter party name"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            {candidates.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-lg">
                <p className="text-muted-foreground">No candidates added yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add candidates to start the election.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {candidates.map(candidate => (
                  <CandidateCard 
                    key={candidate.id}
                    candidate={candidate}
                    isAdmin={true}
                    onEdit={handleEditCandidate}
                    onDelete={handleDeleteCandidate}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="voters" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Manage Voters</h2>
              <Button 
                className="flex items-center" 
                disabled={settings.election_status !== 'not_started' || voters.length >= 69}
                onClick={handleBulkAddVoters}
              >
                <UserPlus className="h-4 w-4 mr-2" /> Generate Voter Accounts
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Voter List</CardTitle>
                <CardDescription>
                  Total registered voters: {voters.length} / 69 (Voted: {voters.filter(v => v.has_voted).length})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {voters.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No voters added yet.</p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-3 bg-muted p-3 rounded-t-md font-medium">
                      <div>USN</div>
                      <div>Password</div>
                      <div>Status</div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {voters.map((voter) => (
                        <div key={voter.id} className="grid grid-cols-3 p-3 border-t">
                          <div>{voter.usn}</div>
                          <div className="font-mono">{voter.password}</div>
                          <div>
                            {voter.has_voted ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Voted
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Not Voted
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Election Results</CardTitle>
                <CardDescription>
                  View current election statistics and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {settings.election_status === 'ended' ? (
                  <div className="text-center py-6">
                    <Button onClick={() => navigate('/results')} className="w-full sm:w-auto">
                      View Complete Results
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      {settings.election_status === 'not_started' 
                        ? 'The election has not started yet.' 
                        : 'The election is currently ongoing.'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {settings.election_status === 'not_started' 
                        ? 'Start the election to allow voters to cast their votes.' 
                        : 'End the election to view and publish the results.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
