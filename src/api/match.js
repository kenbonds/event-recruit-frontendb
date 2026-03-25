import api from './axios';

export const matchApi = {
  // 推荐职位
  getRecommendJobs: () => api.get('/match/recommend'),
  
  // 候选人列表
  getCandidates: (jobId) => api.get(`/match/candidates/${jobId}`)
};
