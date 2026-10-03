import { Kullanici } from '../types';

const AUTH_KEY = 'amb_current_user_v1';

export const AuthService = {
  getCurrentUser(): Kullanici | null {
    const data = sessionStorage.getItem(AUTH_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  login(user: Kullanici): void {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  logout(): void {
    sessionStorage.removeItem(AUTH_KEY);
  }
};
