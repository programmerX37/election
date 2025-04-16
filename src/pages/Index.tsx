import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useElection } from "@/context/ElectionContext";
import { updateSettings } from "@/lib/db";
const Index = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    settings,
    updateElectionSettings
  } = useElection();
  const [electionName, setElectionName] = useState('');
  const handleStartElection = () => {
    if (!electionName.trim()) {
      toast({
        title: "Election Name Required",
        description: "Please enter a name for the election.",
        variant: "destructive"
      });
      return;
    }
    const updatedSettings = updateSettings({
      election_name: `${electionName} Election`,
      election_status: 'ongoing'
    });
    updateElectionSettings(updatedSettings);
    navigate('/admin-login');
  };
  const handleRefresh = () => {
    // Soft refresh of the current page
    window.location.reload();
  };
  const handleClose = () => {
    // Navigate back or close the current window/tab
    window.close();
  };
  return <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button variant="ghost" size="icon" onClick={handleRefresh} className="text-gray-600 hover:text-primary">
          <RefreshCcw className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-600 hover:text-destructive">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6 w-full max-w-md px-4">
        <Card className="w-full hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center text-5xl">Election</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="text" placeholder="Enter the name of the Election" value={electionName} onChange={e => setElectionName(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            <Button onClick={handleStartElection} className="w-full">
              Start Election
            </Button>
          </CardContent>
        </Card>

        {/* Previous Elections Card - Fix for the undefined 'length' error */}
        {settings && settings.previous_elections && settings.previous_elections.length > 0 && <Card className="w-full hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/results')}>
            <CardHeader>
              <CardTitle className="text-center">Previous Elections</CardTitle>
            </CardHeader>
            <CardContent>
              {settings.previous_elections.map((election, index) => <div key={index} className="border-b last:border-b-0 py-2">
                  <div className="flex justify-between">
                    <span>{election.name}</span>
                    <span>{election.end_date}</span>
                  </div>
                  <div>Winners: {election.winners.join(', ')}</div>
                </div>)}
            </CardContent>
          </Card>}
      </div>
    </div>;
};
export default Index;