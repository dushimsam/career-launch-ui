import api from '@/lib/api';

export interface Company {
  companyID: string;
  name: string;
  industry?: string;
  location?: string;
}

export interface University {
  universityID: string;
  name: string;
  location?: string;
  type?: string;
}

export const dataService = {
  // Fetch all companies
  async getCompanies(): Promise<Company[]> {
    try {
      const response = await api.get('/companies');
      return response.data.companies || response.data;
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      return [];
    }
  },

  // Fetch all universities
  async getUniversities(): Promise<University[]> {
    try {
      const response = await api.get('/universities');
      return response.data.universities || response.data;
    } catch (error) {
      console.error('Failed to fetch universities:', error);
      return [];
    }
  },
};
