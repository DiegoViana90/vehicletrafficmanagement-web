import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
