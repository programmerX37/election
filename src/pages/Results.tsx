
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CandidateCard from '@/components/CandidateCard';
import { useElection } from '@/context/ElectionContext';
import { ArrowLeft, Trophy } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Results = () => {
  const { candidates, voters, settings } = useElection();
  const navigate = useNavigate();
  
  // For pie chart
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  const chartColors = ['#1A365D', '#E53E3E', '#ECC94B', '#38A169', '#805AD5'];
  
  // Sort candidates by votes (descending)
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  
  // Get highest vote count
  const highestVotes = sortedCandidates[0]?.votes || 0;
  
  // Find winners (could be multiple if tied)
  const winners = sortedCandidates.filter(c => c.votes === highestVotes);
  
  // Chart data
  const chartData = candidates.map(candidate => ({
    name: candidate.name,
    value: candidate.votes,
  }));

  // Redirect if election not ended and results not visible
  useEffect(() => {
    if (!settings.results_visible) {
      navigate('/');
    }
  }, [settings.results_visible, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-4">
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
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Election Results</h1>
          <p className="text-muted-foreground">
            Final standings and statistics
          </p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Election Statistics</CardTitle>
                <CardDescription>Overview of the voting process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Voter Participation</span>
                    <span className="text-sm text-muted-foreground">
                      {voters.filter(v => v.has_voted).length} / {voters.length} voters
                    </span>
                  </div>
                  <Progress 
                    value={voters.length ? (voters.filter(v => v.has_voted).length / voters.length) * 100 : 0} 
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {voters.length ? Math.round((voters.filter(v => v.has_voted).length / voters.length) * 100) : 0}% of registered voters participated
                  </p>
                </div>
                
                <div className="h-64">
                  <p className="text-sm font-medium mb-2">Vote Distribution</p>
                  {totalVotes > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No votes recorded</p>
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Winners</h3>
                  {winners.length > 0 ? (
                    <div className="space-y-2">
                      {winners.map(winner => (
                        <div 
                          key={winner.id}
                          className="flex items-center space-x-3 p-3 bg-election-accent/10 rounded-md border border-election-accent"
                        >
                          <Trophy className="h-5 w-5 flex-shrink-0 text-election-accent" />
                          <div>
                            <p className="font-medium">{winner.name}</p>
                            <p className="text-sm text-muted-foreground">{winner.party}</p>
                          </div>
                          <div className="ml-auto font-bold">{winner.votes} votes</div>
                        </div>
                      ))}
                      {winners.length > 1 && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          There is a tie between multiple candidates.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No winners to display</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Rankings</CardTitle>
                <CardDescription>Complete results for all candidates</CardDescription>
              </CardHeader>
              <CardContent>
                {candidates.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No candidates available.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sortedCandidates.map((candidate, index) => (
                      <CandidateCard 
                        key={candidate.id}
                        candidate={candidate}
                        rank={index + 1}
                        isResults={true}
                        isWinner={candidate.votes === highestVotes && candidate.votes > 0}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
