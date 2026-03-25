import api from './axios';

export const jobApi = {
  // 职位列表
  getList: (params) => api.get('/jobs', { params }),
  
  // 职位详情
  getDetail: (id) => api.get(`/jobs/${id}`),
  
  // 发布职位
  create: (data) => api.post('/jobs', data),
  
  // 投递简历
  apply: (id) => api.post(`/jobs/${id}/apply`)
};
