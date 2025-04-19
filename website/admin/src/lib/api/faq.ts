import { getToken } from '../utils';

// API URL fallback with proper slash handling
const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5000/mtym-api';
// Remove trailing slash if present
const API_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQData {
  question: string;
  answer: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateFAQData {
  question?: string;
  answer?: string;
  isActive?: boolean;
  order?: number;
}

export const fetchFAQs = async (): Promise<FAQ[]> => {
  const token = getToken();
  console.log("Fetching FAQs with token:", token ? "Found" : "Missing");
  const endpoint = `${API_URL}/faq/all`;
  console.log("API URL:", endpoint);
  
  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch FAQs. Status: ${response.status}`, errorText);
      throw new Error(`Failed to fetch FAQs: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API response for fetchFAQs:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchFAQs:", error);
    throw error;
  }
};

export const fetchFAQ = async (id: number): Promise<FAQ> => {
  const token = getToken();
  console.log(`Fetching FAQ ${id}`);
  const endpoint = `${API_URL}/faq/${id}`;
  
  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch FAQ. Status: ${response.status}`, errorText);
      throw new Error(`Failed to fetch FAQ: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API response for fetchFAQ:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchFAQ:", error);
    throw error;
  }
};

export const createFAQ = async (data: CreateFAQData): Promise<FAQ> => {
  const token = getToken();
  console.log("Creating FAQ with data:", data);
  const endpoint = `${API_URL}/faq`;
  console.log("API URL:", endpoint);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to create FAQ. Status: ${response.status}`, errorText);
      throw new Error(`Failed to create FAQ: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("API response for createFAQ:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error in createFAQ:", error);
    throw error;
  }
};

export const updateFAQ = async (id: number, data: UpdateFAQData): Promise<FAQ> => {
  const token = getToken();
  console.log(`Updating FAQ ${id} with data:`, data);
  const endpoint = `${API_URL}/faq/${id}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update FAQ. Status: ${response.status}`, errorText);
      throw new Error(`Failed to update FAQ: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("API response for updateFAQ:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error in updateFAQ:", error);
    throw error;
  }
};

export const deleteFAQ = async (id: number): Promise<void> => {
  const token = getToken();
  console.log(`Deleting FAQ ${id}`);
  const endpoint = `${API_URL}/faq/${id}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete FAQ. Status: ${response.status}`, errorText);
      throw new Error(`Failed to delete FAQ: ${response.statusText}`);
    }

    console.log(`FAQ ${id} deleted successfully`);
  } catch (error) {
    console.error("Error in deleteFAQ:", error);
    throw error;
  }
}; 