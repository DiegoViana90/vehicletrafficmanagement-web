import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FineDto } from '../services/api';

interface FineState {
  data: FineDto | null;
}

const initialState: FineState = {
  data: null,
};

const fineSlice = createSlice({
  name: 'fine',
  initialState,
  reducers: {
    setFineData(state, action: PayloadAction<FineDto | null>) {
      console.log("Dados armazenados no Redux:", action.payload);
      state.data = action.payload;
    },
    clearFineData(state) {
      state.data = null;
    },
  },
});


export const { setFineData, clearFineData } = fineSlice.actions;
export default fineSlice.reducer;
