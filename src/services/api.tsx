import axios from 'axios';

const API_URL = 'http://192.168.0.112:7053/api/';

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
    randomPassword: string;
    newPassword: string;
}

interface GetCompanyByTaxNumberRequest {
    TaxNumber: string;
}

export interface InsertVehicleRequestDto {
    VehicleModelId: number;
    LicensePlate?: string;
    Chassis: string;
    Color: string;
    FuelType: FuelType;
    Mileage: number;
    Status: VehicleStatus;
    ContractId?: number;
}

export interface VehicleModelDtoResponse {
    vehicleModelId: number;
    modelName: string;
    manufacturer: string;
    observations?: string;
}

export enum FuelType {
    Etanol = 0,
    Gasolina = 1,
    Flex = 2,
    Diesel = 3,
    Híbrido = 4,
    Elétrico = 5,
    Outros = 6
}

export enum VehicleStatus {
    Livre = 0,
    Contrato = 1,
    Manutenção = 2
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

export const insertCompany = async (companyData: any) => {
    const response = await axios.post(`${API_URL}company/InsertCompany`, companyData);
    return response.data;
};

export const updateCompany = async (updateCompanyData: any) => {
    const response = await axios.put(`${API_URL}company/UpdateCompanByTaxNumber`, updateCompanyData);
    return response.data;
};

export const getAllVehicleModels = async (): Promise<VehicleModelDtoResponse[]> => {
    const response = await axios.post(`${API_URL}vehicle/GetAllVehicleModel`);
    return response.data;
};

export const insertVehicleModel = async (modelData: any) => {
    const response = await axios.post(`${API_URL}vehicle/InsertVehicleModel`, modelData);
    return response.data;
};

export const insertVehicle = async (vehicleData: InsertVehicleRequestDto) => {
    const response = await axios.post(`${API_URL}vehicle/InsertVehicle`, vehicleData);
    return response.data;
};
