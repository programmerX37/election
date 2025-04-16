
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
import { ShieldIcon, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginAdmin, admin } = useElection();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (admin) {
      navigate('/admin-dashboard');
    }
  }, [admin, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = loginAdmin(username, password);
      
      if (success) {
        navigate('/admin-dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
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
              <ShieldIcon className="w-12 h-12 mx-auto text-election-primary mb-4" />
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>Access the election management dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="username"
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
                      autoComplete="current-password"
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
                <p className="mb-1">Default Admin Credentials:</p>
                <p>Username: <span className="font-mono">admin</span></p>
                <p>Password: <span className="font-mono">admin123</span></p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
