import React, { createContext, useContext, useState, useEffect } from 'react';
import * as db from '@/lib/db';
import { toast } from "@/components/ui/use-toast";

interface ElectionContextType {
  admin: db.Admin | null;
  voter: db.Voter | null;
  candidates: db.Candidate[];
  voters: db.Voter[];
  settings: db.Settings;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  loginVoter: (usn: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  logoutVoter: () => void;
  addCandidate: (candidate: Omit<db.Candidate, 'id' | 'votes'>) => Promise<db.Candidate>;
  updateCandidate: (id: number, updates: Partial<Omit<db.Candidate, 'id' | 'votes'>>) => Promise<db.Candidate>;
  deleteCandidate: (id: number) => Promise<void>;
  addVoter: (voter: Omit<db.Voter, 'id' | 'has_voted'>) => Promise<db.Voter>;
  bulkAddVoters: (count: number) => Promise<db.Voter[]>;
  submitVote: (candidateId: number) => Promise<void>;
  startElection: () => Promise<void>;
  endElection: () => Promise<void>;
  resetElection: () => Promise<void>;
  updateSettings: (updates: Partial<db.Settings>) => Promise<void>;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<db.Admin | null>(null);
  const [voter, setVoter] = useState<db.Voter | null>(null);
  const [candidates, setCandidates] = useState<db.Candidate[]>([]);
  const [voters, setVoters] = useState<db.Voter[]>([]);
  const [settings, setSettings] = useState<db.Settings>({
    election_status: 'not_started',
    results_visible: false,
    election_name: 'Election',
    previous_elections: []
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesData, votersData, settingsData] = await Promise.all([
          db.getCandidates(),
          db.getVoters(),
          db.getSettings()
        ]);
        
        setCandidates(candidatesData || []);
        setVoters(votersData || []);
        setSettings(settingsData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast({
          title: "Development Mode",
          description: "Using mock data as API connection failed.",
        });
      }
    };
    
    fetchData();
  }, []);

  const loginAdmin = async (username: string, password: string): Promise<boolean> => {
    try {
      const isValid = await db.validateAdminLogin(username, password);
      if (isValid) {
        setAdmin({ id: 1, username, password });
        return true;
      }
      
      // Fallback for development mode with default credentials
      if (username === 'admin' && password === 'admin123') {
        setAdmin({ id: 1, username, password });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Admin login error:", error);
      
      // Fallback for development - accept default credentials even if API fails
      if (username === 'admin' && password === 'admin123') {
        setAdmin({ id: 1, username, password });
        return true;
      }
      
      return false;
    }
  };

  const loginVoter = async (usn: string, password: string): Promise<boolean> => {
    try {
      const voter = await db.validateVoterLogin(usn, password);
      if (voter) {
        setVoter(voter);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Voter login error:", error);
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
  };

  const logoutVoter = () => {
    setVoter(null);
  };

  const addCandidate = async (candidate: Omit<db.Candidate, 'id' | 'votes'>) => {
    try {
      const newCandidate = await db.addCandidate(candidate);
      const updatedCandidates = await db.getCandidates();
      setCandidates(updatedCandidates || []);
      return newCandidate;
    } catch (error) {
      console.error("Error adding candidate:", error);
      throw error;
    }
  };

  const updateCandidate = async (id: number, updates: Partial<Omit<db.Candidate, 'id' | 'votes'>>) => {
    try {
      const updated = await db.updateCandidate(id, updates);
      const updatedCandidates = await db.getCandidates();
      setCandidates(updatedCandidates);
      return updated;
    } catch (error) {
      console.error("Error updating candidate:", error);
      throw error;
    }
  };

  const deleteCandidate = async (id: number) => {
    try {
      await db.deleteCandidate(id);
      const updatedCandidates = await db.getCandidates();
      setCandidates(updatedCandidates);
    } catch (error) {
      console.error("Error deleting candidate:", error);
      throw error;
    }
  };

  const addVoter = async (voter: Omit<db.Voter, 'id' | 'has_voted'>) => {
    try {
      const newVoter = await db.addVoter(voter);
      const updatedVoters = await db.getVoters();
      setVoters(updatedVoters || []);
      return newVoter;
    } catch (error) {
      console.error("Error adding voter:", error);
      throw error;
    }
  };

  const bulkAddVoters = async (count: number) => {
    try {
      const newVoters = await db.bulkAddVoters(count);
      // Ensure we always have an array of voters
      const updatedVoters = await db.getVoters();
      setVoters(updatedVoters || []);
      return newVoters || [];
    } catch (error) {
      console.error("Error adding voters in bulk:", error);
      toast({
        title: "Error",
        description: "Failed to add voters. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  };

  const submitVote = async (candidateId: number) => {
    try {
      if (voter) {
        await db.updateVoterStatus(voter.id, true);
        await db.incrementVote(candidateId);
        
        setVoter({ ...voter, has_voted: true });
        
        // Refresh candidates and voters data
        const [updatedCandidates, updatedVoters] = await Promise.all([
          db.getCandidates(),
          db.getVoters()
        ]);
        
        setCandidates(updatedCandidates || []);
        setVoters(updatedVoters || []);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      throw error;
    }
  };

  const startElection = async () => {
    try {
      const updatedSettings = await db.startElection();
      setSettings(updatedSettings);
    } catch (error) {
      console.error("Error starting election:", error);
      throw error;
    }
  };

  const endElection = async () => {
    try {
      const updatedSettings = await db.endElection();
      setSettings(updatedSettings);
      
      // Make sure to refresh candidates with final vote counts
      const updatedCandidates = await db.getCandidates();
      setCandidates(updatedCandidates);
    } catch (error) {
      console.error("Error ending election:", error);
      toast({
        title: "Error",
        description: "There was a problem ending the election. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const resetElection = async () => {
    try {
      const [updatedSettings, resetCandidates, resetVoters] = await Promise.all([
        db.resetElection(),
        db.resetCandidateVotes(),
        db.resetVoterStatus()
      ]);
      
      setSettings(updatedSettings);
      setCandidates(resetCandidates);
      setVoters(resetVoters);
    } catch (error) {
      console.error("Error resetting election:", error);
      throw error;
    }
  };

  const updateSettings = async (updates: Partial<db.Settings>) => {
    try {
      const updatedSettings = await db.updateSettings(updates);
      setSettings(updatedSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  const value = {
    admin,
    voter,
    candidates,
    voters,
    settings,
    loginAdmin,
    loginVoter,
    logoutAdmin,
    logoutVoter,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    addVoter,
    bulkAddVoters,
    submitVote,
    startElection,
    endElection,
    resetElection,
    updateSettings
  };

  return <ElectionContext.Provider value={value}>{children}</ElectionContext.Provider>;
};

export const useElection = (): ElectionContextType => {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};
