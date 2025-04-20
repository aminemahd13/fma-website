import { TeamMemberCategory } from '@/types/team-member';

export interface TeamMember {
  id: number;
  name: string;
  imageSrc: string;
  linkedinSrc?: string;
  portfolioSrc?: string;
  category: string;
  isActive: boolean;
  order: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5000/mtym-api';

export async function fetchActiveTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await fetch(`${API_URL}team-members`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export async function fetchTeamMembersByCategory(category: TeamMemberCategory): Promise<TeamMember[]> {
  try {
    const response = await fetch(`${API_URL}team-members/category/${category}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${category} team members`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${category} team members:`, error);
    return [];
  }
}