/**
 * 「召集吧」前端 API 模块
 * 封装所有后端接口调用
 */

// API 基础配置
const API_CONFIG = {
  // 开发环境使用本地后端，生产环境使用线上地址
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api/v1'
    : 'https://your-backend-domain.com/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// 获取存储的 Token
function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// 统一请求封装
async function request(url, options = {}) {
  const fullUrl = `${API_CONFIG.baseURL}${url}`;
  
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers
    }
  };
  
  // 添加认证头
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(fullUrl, config);
    const data = await response.json();
    
    if (!response.ok || data.code !== 200) {
      throw new Error(data.message || '请求失败');
    }
    
    return data.data;
  } catch (error) {
    console.error('API 请求失败:', error);
    throw error;
  }
}

// ==================== 认证相关 API ====================

const AuthAPI = {
  // 发送验证码
  sendVerifyCode(phone) {
    return request('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  },
  
  // 登录
  login(phone, code, type = 'user') {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, code, type })
    });
  },
  
  // 个人用户注册
  registerUser(data) {
    return request('/auth/register/user', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // 召集方注册
  registerCompany(data) {
    return request('/auth/register/company', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // 上传毕业证
  uploadDiploma(image) {
    return request('/auth/upload-diploma', {
      method: 'POST',
      body: JSON.stringify({ image })
    });
  },
  
  // 获取用户信息
  getProfile() {
    return request('/auth/profile');
  }
};

// ==================== 活动相关 API ====================

const EventAPI = {
  // 获取活动列表
  getList(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/events?${query}`);
  },
  
  // 获取活动详情
  getDetail(id) {
    return request(`/events/${id}`);
  },
  
  // 获取我报名的活动
  getMyEvents() {
    return request('/events/my');
  },
  
  // 创建活动
  create(data) {
    return request('/events', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // 报名活动
  register(eventId, formData = {}) {
    return request(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({ form_data: formData })
    });
  }
};

// ==================== 岗位相关 API ====================

const JobAPI = {
  // 获取岗位列表
  getList(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/jobs?${query}`);
  },
  
  // 获取岗位详情
  getDetail(id) {
    return request(`/jobs/${id}`);
  },
  
  // 发送验证码（发布岗位用）
  sendVerifyCode(phone) {
    return request('/jobs/verify-code', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  },
  
  // 发布岗位
  create(data) {
    return request('/jobs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // 投递简历
  apply(jobId) {
    return request(`/jobs/${jobId}/apply`, {
      method: 'POST'
    });
  },
  
  // 上传图片
  uploadImage(image, folder = 'jobs/') {
    return request('/jobs/upload-image', {
      method: 'POST',
      body: JSON.stringify({ image, folder })
    });
  }
};

// ==================== 匹配相关 API ====================

const MatchAPI = {
  // 获取推荐岗位
  getRecommendations() {
    return request('/match/recommend');
  },
  
  // 获取候选人列表（召集方用）
  getCandidates(jobId) {
    return request(`/match/candidates/${jobId}`);
  }
};

// ==================== 消息相关 API ====================

const MessageAPI = {
  // 获取未读消息数
  getUnreadCount() {
    return request('/messages/unread-count');
  },
  
  // 获取消息列表
  getList(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/messages?${query}`);
  },
  
  // 标记已读
  markAsRead(messageId) {
    return request(`/messages/${messageId}/read`, {
      method: 'POST'
    });
  }
};

// ==================== 工具函数 ====================

const Utils = {
  // 保存登录状态
  saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // 清除登录状态
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },
  
  // 获取当前用户
  getCurrentUser() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // 检查是否登录
  isLoggedIn() {
    return !!getToken();
  },
  
  // 检查是否召集方
  isCompany() {
    const user = this.getCurrentUser();
    return user && user.type === 'company';
  }
};

// 导出 API 模块
window.API = {
  Auth: AuthAPI,
  Event: EventAPI,
  Job: JobAPI,
  Match: MatchAPI,
  Message: MessageAPI,
  Utils
};
