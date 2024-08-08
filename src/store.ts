// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import fineReducer from './reducers/FineSlice';
import authReducer from './reducers/authReducer';
import companyReducer from './reducers/companySlice';

const store = configureStore({
  reducer: {
    fine: fineReducer,
    auth: authReducer,
    company: companyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
