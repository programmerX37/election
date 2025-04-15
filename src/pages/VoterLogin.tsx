
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useElection } from '@/context/ElectionContext';
import { UserIcon, ArrowLeft } from 'lucide-react';

const VoterLogin = () => {
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginVoter, voter, settings } = useElection();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if election is not ongoing or already logged in
  useEffect(() => {
    if (settings.election_status !== 'ongoing') {
      toast({
        title: "Election not active",
        description: "Voting is not currently available",
        variant: "destructive",
      });
      navigate('/');
    } else if (voter) {
      navigate('/voter-dashboard');
    }
  }, [settings.election_status, voter, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = loginVoter(usn, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to the voting portal",
        });
        navigate('/voter-dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid USN or password, or you may have already voted",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
          </div>
          
          <Card>
            <CardHeader className="text-center">
              <UserIcon className="w-12 h-12 mx-auto text-election-secondary mb-4" />
              <CardTitle>Voter Login</CardTitle>
              <CardDescription>Access the voting portal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="usn">USN (User Serial Number)</Label>
                    <Input
                      id="usn"
                      type="text"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      required
                      placeholder="e.g., USN001"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Default password is 123"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center space-y-2">
              <div className="text-xs text-muted-foreground text-center">
                <p>Contact the administrator if you don't have your voter credentials</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VoterLogin;
