import axios from 'axios';
import { AnimalData } from '@/components/AnimalForm';

const API_BASE_URL = 'http://localhost:3005';

interface GenerateProfileResponse {
  message: string;
  data: {
    originalData: AnimalData;
    generatedProfile: string;
  }
}

export class AnimalService {
  private static instance: AnimalService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_BASE_URL}/api/animals`;
  }

  public static getInstance(): AnimalService {
    if (!AnimalService.instance) {
      AnimalService.instance = new AnimalService();
    }
    return AnimalService.instance;
  }

  async createAnimal(animalData: AnimalData): Promise<GenerateProfileResponse> {
    try {
      const response = await axios.post<GenerateProfileResponse>(`${this.baseUrl}/generate-profile`, animalData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateProfile(animalData: AnimalData): Promise<GenerateProfileResponse> {
    try {
      const response = await axios.post<GenerateProfileResponse>(`${this.baseUrl}/generate-profile`, animalData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAllAnimals(): Promise<any> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAnimalById(id: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.message || 'An error occurred while processing your request');
    }
    return error;
  }
} 