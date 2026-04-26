import { create } from 'zustand';

// Inicialização síncrona — lê o localStorage antes de qualquer render
const storedToken = localStorage.getItem('token');
const storedUser  = JSON.parse(localStorage.getItem('user') || 'null');

const useAuthStore = create((set) => ({
  user:            storedUser,
  token:           storedToken,
  isAuthenticated: !!(storedToken && storedUser),

  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  // Mantido para compatibilidade, mas a hidratação já ocorre na criação da store
  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    const user  = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) set({ token, user, isAuthenticated: true });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
