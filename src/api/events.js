import api from './axios';

export const eventApi = {
  // 活动列表
  getList: (params) => api.get('/events', { params }),
  
  // 活动详情
  getDetail: (id) => api.get(`/events/${id}`),
  
  // 创建活动
  create: (data) => api.post('/events', data),
  
  // 报名活动
  register: (id, formData) => api.post(`/events/${id}/register`, { form_data: formData }),
  
  // 我的报名
  getMyRegistrations: () => api.get('/events/my')
};
