import { createAction } from '@reduxjs/toolkit';

export const login = createAction<{ token: string; user: any }>('auth/login');
export const logout = createAction('auth/logout');
