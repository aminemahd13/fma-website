import { getToken } from '../utils';

// API URL fallback with proper slash handling
const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5000/mtym-api';
// Remove trailing slash if present
const API_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

export enum MedalType {
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze',
  HONORABLE_MENTION = 'honorable_mention',
  NONE = 'none'
}

export interface CompetitionResult {
  id: number;
  rank: number;
  name: string;
  school: string;
  score: number | null;
  medal: MedalType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompetitionResultData {
  rank: number;
  name: string;
  school: string;
  score?: number;
  medal?: MedalType;
  isActive?: boolean;
}

export interface UpdateCompetitionResultData {
  rank?: number;
  name?: string;
  school?: string;
  score?: number;
  medal?: MedalType;
  isActive?: boolean;
}

export async function fetchCompetitionResults(): Promise<CompetitionResult[]> {
  const token = getToken();
  console.log("Fetching competition results...");
  const response = await fetch(`${API_URL}/competition-results/all`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error fetching competition results:", errorText);
    throw new Error(`Failed to fetch competition results: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log("Successfully fetched competition results:", data);
  return data;
}

export async function fetchCompetitionResult(id: number): Promise<CompetitionResult> {
  const token = getToken();
  const response = await fetch(`${API_URL}/competition-results/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch competition result with ID ${id}: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function createCompetitionResult(data: CreateCompetitionResultData): Promise<CompetitionResult> {
  const token = getToken();
  console.log("Creating competition result with data:", data);
  
  try {
    const response = await fetch(`${API_URL}/competition-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    console.log("Create response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error creating competition result:", errorText);
      throw new Error(`Failed to create competition result: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("Successfully created competition result:", result);
    return result;
  } catch (error) {
    console.error("Exception during competition result creation:", error);
    throw error;
  }
}

export async function updateCompetitionResult(id: number, data: UpdateCompetitionResultData): Promise<CompetitionResult> {
  const token = getToken();
  console.log(`Updating competition result #${id} with data:`, data);
  
  try {
    const response = await fetch(`${API_URL}/competition-results/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error updating competition result #${id}:`, errorText);
      throw new Error(`Failed to update competition result with ID ${id}: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("Successfully updated competition result:", result);
    return result;
  } catch (error) {
    console.error(`Exception during competition result #${id} update:`, error);
    throw error;
  }
}

export async function deleteCompetitionResult(id: number): Promise<void> {
  const token = getToken();
  console.log(`Deleting competition result #${id}`);
  
  try {
    const response = await fetch(`${API_URL}/competition-results/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error deleting competition result #${id}:`, errorText);
      throw new Error(`Failed to delete competition result with ID ${id}: ${response.status} ${errorText}`);
    }
    
    console.log(`Successfully deleted competition result #${id}`);
  } catch (error) {
    console.error(`Exception during competition result #${id} deletion:`, error);
    throw error;
  }
} 