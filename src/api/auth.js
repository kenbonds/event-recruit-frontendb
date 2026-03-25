import api from './axios';

export const authApi = {
  // 登录
  login: (phone, code) => api.post('/auth/login', { phone, code }),
  
  // 注册
  register: (phone, nickname) => api.post('/auth/register', { phone, nickname }),
  
  // 获取用户信息
  getProfile: () => api.get('/auth/profile'),
  
  // 更新用户信息
  updateProfile: (data) => api.put('/auth/profile', data)
};
