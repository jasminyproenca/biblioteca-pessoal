import api from './axios';

export const updateProfile = (data) => api.put('/users/me', data);
