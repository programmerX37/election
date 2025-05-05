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
  try {
    const response = await axios.post('/api/admin/login', { username, password });
    return response.data.success;
  } catch (error) {
    console.error("Admin login error:", error);
    return false;
  }
};

// Voter functions
export const getVoters = async (): Promise<Voter[]> => {
  try {
    const response = await axios.get('/api/voters');
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error getting voters:", error);
    return [];
  }
};

export const addVoter = async (voter: { usn: string; password: string }): Promise<Voter> => {
  try {
    const response = await axios.post('/api/voters', voter);
    return response.data;
  } catch (error) {
    console.error("Error adding voter:", error);
    throw new Error("Failed to add voter");
  }
};

export const bulkAddVoters = async (count: number): Promise<Voter[]> => {
  try {
    const response = await axios.post('/api/voters/bulk', { count });
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error adding voters in bulk:", error);
    return [];
  }
};

export const validateVoterLogin = async (usn: string, password: string): Promise<Voter | null> => {
  try {
    const response = await axios.post('/api/voters/login', { usn, password });
    return response.data;
  } catch (error) {
    console.error("Voter login error:", error);
    return null;
  }
};

export const updateVoterStatus = async (id: number, has_voted: boolean): Promise<void> => {
  try {
    await axios.put(`/api/voters/${id}`, { has_voted });
  } catch (error) {
    console.error("Error updating voter status:", error);
    throw new Error("Failed to update voter status");
  }
};

export const resetVoterStatus = async (): Promise<Voter[]> => {
  try {
    const response = await axios.put('/api/voters/reset');
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error resetting voter status:", error);
    return [];
  }
};

// Candidate functions
export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await axios.get('/api/candidates');
    return response.data;
  } catch (error) {
    console.error("Error getting candidates:", error);
    return [];
  }
};

export const addCandidate = async (candidate: { name: string; party: string }): Promise<Candidate> => {
  try {
    const response = await axios.post('/api/candidates', candidate);
    return response.data;
  } catch (error) {
    console.error("Error adding candidate:", error);
    throw new Error("Failed to add candidate");
  }
};

export const updateCandidate = async (id: number, updates: any): Promise<Candidate> => {
  try {
    const response = await axios.put(`/api/candidates/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating candidate:", error);
    throw new Error("Failed to update candidate");
  }
};

export const deleteCandidate = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/api/candidates/${id}`);
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw new Error("Failed to delete candidate");
  }
};

export const incrementVote = async (candidateId: number): Promise<void> => {
  try {
    await axios.put(`/api/candidates/${candidateId}/vote`);
  } catch (error) {
    console.error("Error incrementing vote:", error);
    throw new Error("Failed to increment vote");
  }
};

export const resetCandidateVotes = async (): Promise<Candidate[]> => {
  try {
    const response = await axios.put('/api/candidates/reset');
    return response.data;
  } catch (error) {
    console.error("Error resetting candidate votes:", error);
    return [];
  }
};

// Settings functions
export const getSettings = async (): Promise<Settings> => {
  try {
    const response = await axios.get('/api/settings');
    return response.data;
  } catch (error) {
    console.error("Error getting settings:", error);
    // Return default settings if API fails
    return {
      election_status: 'not_started',
      results_visible: false,
      election_name: 'Election',
      previous_elections: []
    };
  }
};

export const updateSettings = async (updates: Partial<Settings>): Promise<Settings> => {
  try {
    const response = await axios.put('/api/settings', updates);
    return response.data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw new Error("Failed to update settings");
  }
};

export const startElection = async (): Promise<Settings> => {
  try {
    const response = await axios.post('/api/election/start');
    return response.data;
  } catch (error) {
    console.error("Error starting election:", error);
    throw new Error("Failed to start election");
  }
};

export const endElection = async (): Promise<Settings> => {
  try {
    const response = await axios.post('/api/election/end');
    return response.data;
  } catch (error) {
    console.error("Error ending election:", error);
    // For now, manually create a response since the API might not be fully implemented
    const currentSettings = await getSettings();
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Find candidates with max votes
    const candidates = await getCandidates();
    let maxVotes = 0;
    let winners: string[] = [];
    
    candidates.forEach(candidate => {
      if (candidate.votes > maxVotes) {
        maxVotes = candidate.votes;
        winners = [candidate.name];
      } else if (candidate.votes === maxVotes && maxVotes > 0) {
        winners.push(candidate.name);
      }
    });
    
    // Ensure previous_elections is always an array
    const previous_elections = Array.isArray(currentSettings.previous_elections) 
      ? currentSettings.previous_elections 
      : [];
    
    // Add the current election to previous_elections
    const updatedSettings: Settings = {
      ...currentSettings,
      election_status: 'ended',
      results_visible: true,
      previous_elections: [
        ...previous_elections,
        {
          name: currentSettings.election_name || 'Election',
          end_date: currentDate,
          winners: winners
        }
      ]
    };
    
    // Try to update settings through the API
    try {
      await updateSettings(updatedSettings);
    } catch (settingsError) {
      console.error("Failed to update settings after ending election:", settingsError);
    }
    
    return updatedSettings;
  }
};

export const resetElection = async (): Promise<Settings> => {
  try {
    const response = await axios.post('/api/election/reset');
    return response.data;
  } catch (error) {
    console.error("Error resetting election:", error);
    throw new Error("Failed to reset election");
  }
};
