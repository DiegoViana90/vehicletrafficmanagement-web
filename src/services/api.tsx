import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://192.168.0.112:7053/api/';

interface LoginResponse {
  token: string;
  companiesId: number;
}

interface CompanyDto {
  id: number;
  tradeName: string;
  cnpj: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await axios.post(`${API_URL}auth/login`, { email, password });
  return response.data;
};

export const getCompanyById = async (id: number, token: string): Promise<CompanyDto> => {
  const response: AxiosResponse<CompanyDto> = await axios.get(`${API_URL}company/GetCompanyById?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
