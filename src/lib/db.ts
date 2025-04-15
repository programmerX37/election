
// Mock database using localStorage

// Types
export interface Admin {
  id: number;
  username: string;
  password: string;
}

export interface Voter {
  id: number;
  usn: string;
  password: string;
  has_voted: boolean;
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  votes: number;
}

export type ElectionStatus = 'not_started' | 'ongoing' | 'ended';

export interface Settings {
  election_status: ElectionStatus;
  results_visible: boolean;
}

// Initialize database
const initializeDB = () => {
  // Admin
  if (!localStorage.getItem('admin')) {
    localStorage.setItem('admin', JSON.stringify([
      { id: 1, username: 'admin', password: 'admin123' }
    ]));
  }

  // Voters (initially empty)
  if (!localStorage.getItem('voters')) {
    localStorage.setItem('voters', JSON.stringify([]));
  }

  // Candidates (initially empty)
  if (!localStorage.getItem('candidates')) {
    localStorage.setItem('candidates', JSON.stringify([]));
  }

  // Settings
  if (!localStorage.getItem('settings')) {
    localStorage.setItem('settings', JSON.stringify({
      election_status: 'not_started',
      results_visible: false
    }));
  }
};

// Admin functions
export const validateAdminLogin = (username: string, password: string): boolean => {
  const admins = JSON.parse(localStorage.getItem('admin') || '[]') as Admin[];
  return admins.some(admin => admin.username === username && admin.password === password);
};

// Voter functions
export const getVoters = (): Voter[] => {
  return JSON.parse(localStorage.getItem('voters') || '[]');
};

export const addVoter = (voter: Omit<Voter, 'id'>): Voter => {
  const voters = getVoters();
  const newVoter = {
    id: voters.length ? Math.max(...voters.map(v => v.id)) + 1 : 1,
    ...voter,
  };
  
  localStorage.setItem('voters', JSON.stringify([...voters, newVoter]));
  return newVoter;
};

export const bulkAddVoters = (count: number): Voter[] => {
  const voters = getVoters();
  const startId = voters.length ? Math.max(...voters.map(v => v.id)) + 1 : 1;
  
  const newVoters: Voter[] = [];
  
  for (let i = 0; i < count; i++) {
    const id = startId + i;
    newVoters.push({
      id,
      usn: `USN${String(id).padStart(3, '0')}`,
      password: '123',
      has_voted: false
    });
  }
  
  localStorage.setItem('voters', JSON.stringify([...voters, ...newVoters]));
  return newVoters;
};

export const validateVoterLogin = (usn: string, password: string): Voter | null => {
  const voters = getVoters();
  const voter = voters.find(v => v.usn === usn && v.password === password);
  return voter || null;
};

export const updateVoterStatus = (id: number, has_voted: boolean): void => {
  const voters = getVoters();
  const updatedVoters = voters.map(voter => 
    voter.id === id ? { ...voter, has_voted } : voter
  );
  
  localStorage.setItem('voters', JSON.stringify(updatedVoters));
};

// Candidate functions
export const getCandidates = (): Candidate[] => {
  return JSON.parse(localStorage.getItem('candidates') || '[]');
};

export const addCandidate = (candidate: Omit<Candidate, 'id' | 'votes'>): Candidate => {
  const candidates = getCandidates();
  
  if (candidates.length >= 5) {
    throw new Error('Maximum of 5 candidates allowed');
  }
  
  const newCandidate = {
    id: candidates.length ? Math.max(...candidates.map(c => c.id)) + 1 : 1,
    ...candidate,
    votes: 0
  };
  
  localStorage.setItem('candidates', JSON.stringify([...candidates, newCandidate]));
  return newCandidate;
};

export const updateCandidate = (id: number, updates: Partial<Omit<Candidate, 'id' | 'votes'>>): Candidate => {
  const candidates = getCandidates();
  const updatedCandidates = candidates.map(candidate => 
    candidate.id === id ? { ...candidate, ...updates } : candidate
  );
  
  localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
  return updatedCandidates.find(c => c.id === id) as Candidate;
};

export const deleteCandidate = (id: number): void => {
  const candidates = getCandidates();
  const filteredCandidates = candidates.filter(candidate => candidate.id !== id);
  
  localStorage.setItem('candidates', JSON.stringify(filteredCandidates));
};

export const incrementVote = (candidateId: number): void => {
  const candidates = getCandidates();
  const updatedCandidates = candidates.map(candidate => 
    candidate.id === candidateId 
      ? { ...candidate, votes: candidate.votes + 1 } 
      : candidate
  );
  
  localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
};

// Settings functions
export const getSettings = (): Settings => {
  return JSON.parse(localStorage.getItem('settings') || '{}') as Settings;
};

export const updateSettings = (updates: Partial<Settings>): Settings => {
  const settings = getSettings();
  const updatedSettings = { ...settings, ...updates };
  
  localStorage.setItem('settings', JSON.stringify(updatedSettings));
  return updatedSettings;
};

export const startElection = (): Settings => {
  return updateSettings({ election_status: 'ongoing' });
};

export const endElection = (): Settings => {
  return updateSettings({ 
    election_status: 'ended',
    results_visible: true 
  });
};

// Initialize the database on module import
initializeDB();

// Export a function to reset the database (for testing)
export const resetDB = (): void => {
  localStorage.removeItem('admin');
  localStorage.removeItem('voters');
  localStorage.removeItem('candidates');
  localStorage.removeItem('settings');
  initializeDB();
};
