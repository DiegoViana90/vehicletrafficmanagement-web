import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import companyReducer from './reducers/companySlice';

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
  },
});

export default store;
