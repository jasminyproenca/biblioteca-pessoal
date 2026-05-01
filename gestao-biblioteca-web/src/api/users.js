import api from './axios';

export const updateProfile = (data) => api.patch('/users/me', data);
