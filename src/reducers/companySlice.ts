import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CompanyState {
  existingCompanyData: any | null;
}

const initialState: CompanyState = {
  existingCompanyData: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setExistingCompanyData(state, action: PayloadAction<any>) {
      state.existingCompanyData = action.payload;
    },
    clearExistingCompanyData(state) {
      state.existingCompanyData = null;
    },
  },
});

export const { setExistingCompanyData, clearExistingCompanyData } = companySlice.actions;
export default companySlice.reducer;
