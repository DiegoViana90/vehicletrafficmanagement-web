import { createReducer } from '@reduxjs/toolkit';
import { login, logout } from '../actions/authActions';

interface AuthState {
  token: string | null;
  user: any | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    })
    .addCase(logout, (state) => {
      state.token = null;
      state.user = null;
    });
});

export default authReducer;
