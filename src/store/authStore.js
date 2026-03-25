import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 状态
      token: null,
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // 登录
      login: async (phone, code) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(phone, code);
          if (res.code === 200) {
            set({
              token: res.data.token,
              user: res.data.user,
              isAuthenticated: true,
              isLoading: false
            });
            localStorage.setItem('token', res.data.token);
            return { success: true };
          }
          throw new Error(res.message);
        } catch (err) {
          set({ error: err.message || '登录失败', isLoading: false });
          return { success: false, error: err.message };
        }
      },

      // 注册
      register: async (phone, nickname) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register(phone, nickname);
          if (res.code === 201) {
            set({
              token: res.data.token,
              user: res.data.user,
              isAuthenticated: true,
              isLoading: false
            });
            localStorage.setItem('token', res.data.token);
            return { success: true };
          }
          throw new Error(res.message);
        } catch (err) {
          set({ error: err.message || '注册失败', isLoading: false });
          return { success: false, error: err.message };
        }
      },

      // 获取用户信息
      fetchUser: async () => {
        try {
          const res = await authApi.getProfile();
          if (res.code === 200) {
            set({ user: res.data, isAuthenticated: true });
            return res.data;
          }
        } catch (err) {
          get().logout();
        }
      },

      // 退出登录
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false, error: null });
      },

      // 清除错误
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);
