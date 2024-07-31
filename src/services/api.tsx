import axios from 'axios';
import { UserType, VehicleStatus, ContractStatus, CompanyStatus, FuelType, VehicleManufacturers } from '../constants/enum';

const API_URL = process.env.REACT_APP_API_URL;

export interface InsertContractRequestDto {
  ServiceProviderCompanyId: number;
  ClientCompanyId: number;
  StartDate: string;
  EndDate?: string;
  Status: ContractStatus;
  VehicleIds: number[];
}

export interface UpdateContractRequestDto {
  Id: number;
  ServiceProviderCompanyId: number;
  ClientCompanyId: number;
  StartDate: string;
  EndDate?: string;
  Status: ContractStatus;
  VehicleIds: number[];
}

export interface ContractDto {
  id: number;
  serviceProviderCompanyId: number;
  clientCompanyId: number;
  startDate: string;
  endDate?: string;
  status: ContractStatus;
  vehicleIds: number[];
}

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
  CompanyRelated: number;
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
  modelName: string;
  manufacturer: VehicleManufacturers;
  observations: string;
  renavam: string;
  vehicleValue: number;
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
  CompaniesId: number;
  RENAVAM: string;
  VehicleValue: number;
}

export interface VehicleModelDtoResponse {
  vehicleModelId: number;
  modelName: string;
  manufacturer: VehicleManufacturers;
  observations?: string;
}

export interface VehicleDto {
  id: number;
  modelName: string;
}

export interface ClientDto {
  id: number;
  companiesId: number;
  name: string;
  taxNumber: string; 
}

export interface GetVehicleHistoricRequest {
  licensePlate?: string;
  chassis?: string;
}

export interface GetVehicleHistoricResponse {
  vehicleId: number;
  vehicleHistoricId: number;
  licensePlate: string;
  chassi: string;
  contractId: number | null;
  companyName: string | null;
  companyTaxNumber: string | null;
  inclusionDateTime: Date;
  removalDateTime?: Date | null;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}auth/Login`, { email, password }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getCompanyById = async (id: number, token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}company/GetCompanyById?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
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

export const GetCompanyByTaxNumberAndCompanyRelated = async (taxNumber: string, companyRelated: number): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}company/GetCompanyByTaxNumberAndCompanyRelated`, {
      TaxNumber: taxNumber,
      CompanyRelated: companyRelated
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status !== 200) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao chamar a API GetCompanyByTaxNumberAndCompanyRelated:', error);
    throw error;
  }
};

export const changePassword = async (data: UpdatePasswordRequest): Promise<any> => {
  try {
    const response = await axios.put(`${API_URL}auth/UpdateFirstPassword`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
  const response = await axios.post(`${API_URL}company/InsertCompany`, companyData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const updateCompanyByTaxNumberAndCompanyRelated = async (updateCompanyData: any) => {
  const response = await axios.put(`${API_URL}company/UpdateCompanyByTaxNumberAndCompanyRelated`, updateCompanyData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getAllVehicleModels = async (): Promise<VehicleModelDtoResponse[]> => {
  const response = await axios.post(`${API_URL}vehicle/GetAllVehicleModel`, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const insertVehicleModel = async (modelData: any) => {
  const response = await axios.post(`${API_URL}vehicle/InsertVehicleModel`, modelData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const insertVehicle = async (vehicleData: InsertVehicleRequestDto) => {
  const response = await axios.post(`${API_URL}vehicle/InsertVehicle`, vehicleData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getVehicleByChassis = async (chassis: string, companiesId: number): Promise<GetVehicleDto | null> => {
  try {
    const response = await axios.post(`${API_URL}vehicle/GetVehicleByChassis`, {
      Chassis: chassis,
      CompaniesId: companiesId,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar veículo pelo chassi:', error);
    return null;
  }
};

export const getVehicleByLicensePlate = async (licensePlate: string, companiesId: number): Promise<GetVehicleDto | null> => {
  try {
    console.log(licensePlate)
    console.log(companiesId)

    const response = await axios.post(`${API_URL}vehicle/GetVehicleByLicensePlate`, {
      LicensePlate: licensePlate,
      CompaniesId: companiesId,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar veículo pela placa:', error);
    return null;
  }
};

export const getVehicleByQRCode = async (qrCode: string, companiesId: number): Promise<GetVehicleDto | null> => {
  try {
    const response = await axios.post(`${API_URL}vehicle/GetVehicleByQRCode`, {
      QRCode: qrCode,
      CompaniesId: companiesId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar veículo pelo QR code:', error);
    return null;
  }
};

export const getAllContracts = async (): Promise<ContractDto[]> => {
  const response = await axios.get(`${API_URL}contract/GetAllContracts`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getAllVehiclesFromCompany = async (data: { CompaniesId: number }): Promise<GetVehicleDto[]> => {
  const response = await axios.post(`${API_URL}vehicle/GetAllVehiclesFromCompany`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getAllCompaniesByCompany = async (data: { CompanyRelated: number }): Promise<ClientDto[]> => {
  const response = await axios.post(`${API_URL}company/GetAllCompaniesByCompany`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const insertContract = async (contractData: InsertContractRequestDto): Promise<void> => {
  await axios.post(`${API_URL}contract/InsertContract`, contractData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getContractByCompanyName = async (data: { Name: string, CompaniesId: number }): Promise<ContractDto> => {
  const response = await axios.post(`${API_URL}contract/GetContractByCompanyName`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const updateContract = async (contractData: UpdateContractRequestDto): Promise<void> => {
  await axios.put(`${API_URL}contract/UpdateContract`, contractData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export async function getContractByCompanyId(id: number): Promise<ContractDto> {
  const response = await axios.get<ContractDto>(`/api/contracts/company/${id}`);
  return response.data;
}

export const getVehicleHistoric = async (data: GetVehicleHistoricRequest): Promise<GetVehicleHistoricResponse[]> => {
  const response = await axios.post(`${API_URL}vehicle/GetVehicleHistoric`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};