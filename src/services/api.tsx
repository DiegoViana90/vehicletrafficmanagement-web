import axios from 'axios';
import { UserType, VehicleStatus, ContractStatus, CompanyStatus, FuelType, VehicleManufacturers } from '../constants/enum';

const API_URL = process.env.REACT_APP_API_URL;

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

export interface GetVehicleDto {
    id: number;
    vehicleModelId: number;
    licensePlate: string;
    chassis: string;
    color: string;
    fuelType: FuelType;
    mileage: number;
    status: VehicleStatus;
    contractId?: number; 
    modelYear: string;
    manufactureYear: string;
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
    ModelYear: string;
    ManufactureYear: string;
}

export interface VehicleModelDtoResponse {
    vehicleModelId: number;
    modelName: string;
    manufacturer: VehicleManufacturers;
    observations?: string;
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

export const getVehicleByChassis = async (chassis: string): Promise<GetVehicleDto | null> => {
    try {
        const response = await axios.post(`${API_URL}vehicle/GetVehicleByChassis`, {
            Chassis: chassis
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar veículo pelo chassi:', error);
        return null;
    }
};
