import axios from 'axios';

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

interface PreviousElection {
  name: string;
  end_date: string;
  winners?: string[];
}

export interface Settings {
  election_status: ElectionStatus;
  results_visible: boolean;
  election_name: string;
  previous_elections: PreviousElection[];
}

// Admin functions
export const validateAdminLogin = async (username: string, password: string): Promise<boolean> => {
  const response = await axios.post('/api/admin/login', { username, password });
  return response.data.success;
};

// Voter functions
export const getVoters = async (): Promise<any[]> => {
  const response = await axios.get('/api/voters');
  return response.data;
};

export const addVoter = async (voter: { usn: string; password: string }): Promise<any> => {
  const response = await axios.post('/api/voters', voter);
  return response.data;
};

export const bulkAddVoters = async (count: number): Promise<any[]> => {
  const response = await axios.post('/api/voters/bulk', { count });
  return response.data;
};

export const validateVoterLogin = async (usn: string, password: string): Promise<any> => {
  const response = await axios.post('/api/voters/login', { usn, password });
  return response.data;
};

export const updateVoterStatus = async (id: number, has_voted: boolean): Promise<void> => {
  await axios.put(`/api/voters/${id}`, { has_voted });
};

export const resetVoterStatus = async (): Promise<void> => {
  await axios.put('/api/voters/reset');
};

// Candidate functions
export const getCandidates = async (): Promise<any[]> => {
  const response = await axios.get('/api/candidates');
  return response.data;
};

export const addCandidate = async (candidate: { name: string; party: string }): Promise<any> => {
  const response = await axios.post('/api/candidates', candidate);
  return response.data;
};

export const updateCandidate = async (id: number, updates: any): Promise<any> => {
  const response = await axios.put(`/api/candidates/${id}`, updates);
  return response.data;
};

export const deleteCandidate = async (id: number): Promise<void> => {
  await axios.delete(`/api/candidates/${id}`);
};

export const incrementVote = async (candidateId: number): Promise<void> => {
  await axios.put(`/api/candidates/${candidateId}/vote`);
};

export const resetCandidateVotes = async (): Promise<void> => {
  await axios.put('/api/candidates/reset');
};

// Settings functions
export const getSettings = async (): Promise<any> => {
  const response = await axios.get('/api/settings');
  return response.data;
};

export const updateSettings = async (updates: any): Promise<any> => {
  const response = await axios.put('/api/settings', updates);
  return response.data;
};

export const startElection = async (): Promise<any> => {
  const response = await axios.post('/api/election/start');
  return response.data;
};

export const endElection = async (): Promise<any> => {
  const response = await axios.post('/api/election/end');
  return response.data;
};

export const resetElection = async (): Promise<any> => {
  const response = await axios.post('/api/election/reset');
  return response.data;
};
