import axios, { AxiosResponse } from 'axios';

const API_URL = 'https://192.168.0.9:7053/api/auth/';

interface LoginResponse {
  token: string;
  company?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(`${API_URL}login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};
