import { getToken } from '../utils';

// API URL fallback with proper slash handling
const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://fma-api.aminemahdane.com/mtym-api';
// Remove trailing slash if present
const API_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

export interface TeamMember {
  id: number;
  name: string;
  imageSrc: string;
  linkedinSrc?: string;
  portfolioSrc?: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateTeamMemberData = Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTeamMemberData = Partial<CreateTeamMemberData>;

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const token = getToken();
  const response = await fetch(`${API_URL}/team-members/all`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch team members');
  }

  return response.json();
}

export async function fetchTeamMember(id: number): Promise<TeamMember> {
  const token = getToken();
  const response = await fetch(`${API_URL}/team-members/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch team member with ID ${id}`);
  }

  return response.json();
}

export async function createTeamMember(data: CreateTeamMemberData): Promise<TeamMember> {
  const token = getToken();
  const response = await fetch(`${API_URL}/team-members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create team member');
  }

  return response.json();
}

export async function updateTeamMember(id: number, data: UpdateTeamMemberData): Promise<TeamMember> {
  const token = getToken();
  const response = await fetch(`${API_URL}/team-members/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to update team member with ID ${id}`);
  }

  return response.json();
}

export async function deleteTeamMember(id: number): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_URL}/team-members/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to delete team member with ID ${id}`);
  }
}