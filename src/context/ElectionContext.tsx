
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as db from '@/lib/db';

interface ElectionContextType {
  admin: db.Admin | null;
  voter: db.Voter | null;
  candidates: db.Candidate[];
  voters: db.Voter[];
  settings: db.Settings;
  loginAdmin: (username: string, password: string) => boolean;
  loginVoter: (usn: string, password: string) => boolean;
  logoutAdmin: () => void;
  logoutVoter: () => void;
  addCandidate: (candidate: Omit<db.Candidate, 'id' | 'votes'>) => db.Candidate;
  updateCandidate: (id: number, updates: Partial<Omit<db.Candidate, 'id' | 'votes'>>) => db.Candidate;
  deleteCandidate: (id: number) => void;
  addVoter: (voter: Omit<db.Voter, 'id'>) => db.Voter;
  bulkAddVoters: (count: number) => db.Voter[];
  submitVote: (candidateId: number) => void;
  startElection: () => void;
  endElection: () => void;
  updateSettings: (updates: Partial<db.Settings>) => void;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<db.Admin | null>(null);
  const [voter, setVoter] = useState<db.Voter | null>(null);
  const [candidates, setCandidates] = useState<db.Candidate[]>([]);
  const [voters, setVoters] = useState<db.Voter[]>([]);
  const [settings, setSettings] = useState<db.Settings>({
    election_status: 'not_started',
    election_name: '',
    results_visible: false,
    previous_elections: []
  });

  // Initialize and load data
  useEffect(() => {
    setCandidates(db.getCandidates());
    setVoters(db.getVoters());
    setSettings(db.getSettings());
  }, []);

  const loginAdmin = (username: string, password: string): boolean => {
    const isValid = db.validateAdminLogin(username, password);
    if (isValid) {
      setAdmin({ id: 1, username, password });
    }
    return isValid;
  };

  const loginVoter = (usn: string, password: string): boolean => {
    const voter = db.validateVoterLogin(usn, password);
    if (voter) {
      setVoter(voter);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdmin(null);
  };

  const logoutVoter = () => {
    setVoter(null);
  };

  const addCandidate = (candidate: Omit<db.Candidate, 'id' | 'votes'>) => {
    const newCandidate = db.addCandidate(candidate);
    setCandidates(db.getCandidates());
    return newCandidate;
  };

  const updateCandidate = (id: number, updates: Partial<Omit<db.Candidate, 'id' | 'votes'>>) => {
    const updated = db.updateCandidate(id, updates);
    setCandidates(db.getCandidates());
    return updated;
  };

  const deleteCandidate = (id: number) => {
    db.deleteCandidate(id);
    setCandidates(db.getCandidates());
  };

  const addVoter = (voter: Omit<db.Voter, 'id'>) => {
    const newVoter = db.addVoter(voter);
    setVoters(db.getVoters());
    return newVoter;
  };

  const bulkAddVoters = (count: number) => {
    const newVoters = db.bulkAddVoters(count);
    setVoters(db.getVoters());
    return newVoters;
  };

  const submitVote = (candidateId: number) => {
    if (voter) {
      db.updateVoterStatus(voter.id, true);
      db.incrementVote(candidateId);
      
      // Update local state
      setVoter({ ...voter, has_voted: true });
      setCandidates(db.getCandidates());
      setVoters(db.getVoters());
    }
  };

  const startElection = () => {
    const updatedSettings = db.startElection();
    setSettings(updatedSettings);
  };

  const endElection = () => {
    const updatedSettings = db.endElection();
    setSettings(updatedSettings);
  };

  const updateSettings = (updates: Partial<db.Settings>) => {
    const updatedSettings = db.updateSettings(updates);
    setSettings(updatedSettings);
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
