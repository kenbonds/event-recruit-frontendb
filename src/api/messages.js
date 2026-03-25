import api from './axios';

export const messageApi = {
  // 消息列表
  getList: (params) => api.get('/messages', { params }),
  
  // 标记已读
  markRead: (id) => api.post(`/messages/${id}/read`),
  
  // 未读数
  getUnreadCount: () => api.get('/messages/unread-count')
};
