import axios from 'axios';

const API_URL = 'http://192.168.100.12:7053/api/';

interface AuthResponse {
    token: string;
    userId: number;
    fullName: string;
    email: string;
    userType: number;
    isFirstAccess: boolean;
    isBlocked: boolean;
    companiesId?: number;
    company?: any;
}

interface UpdatePasswordRequest {
    userId: number;
    randomPassword: string; // Correspondente ao campo da API
    newPassword: string;
}

interface GetCompanyByTaxNumberRequest {
    TaxNumber: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}auth/Login`, { email, password });
    return response.data;
};

export const getCompanyById = async (id: number, token: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}company/GetCompanyById?id=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status !== 200) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error('Erro ao chamar a API getCompanyById:', error);
        throw error;
    }
};

export const getCompanyByTaxNumber = async (taxNumber: string): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}company/GetCompanyByTaxNumber`, {
            TaxNumber: taxNumber
        });

        if (response.status !== 200) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error('Erro ao chamar a API getCompanyByTaxNumber:', error);
        throw error;
    }
};

export const changePassword = async (data: UpdatePasswordRequest): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}auth/UpdateFirstPassword`, data);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data); 
        } else {
            throw error;
        }
    }
};
