// CloudBase 云函数 API 配置
const CloudBaseAPI = {
  // 基础配置
  config: {
    baseURL: 'https://zhaojiba1-0gqnm5h075fc5ccf-1300229407.ap-shanghai.app.tcloudbase.com',
    apiPrefix: '/api',
    timeout: 10000 // 10秒超时
  },

  // 构建完整的 API URL
  getURL(endpoint) {
    return `${this.config.baseURL}${this.config.apiPrefix}${endpoint}`;
  },

  // 通用请求方法
  async request(endpoint, data = {}) {
    const url = this.getURL(endpoint);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // 统一错误处理
      if (result.code !== 200) {
        throw new Error(result.message || '请求失败');
      }

      return result;
    } catch (error) {
      console.error('API 请求错误:', error);
      throw error;
    }
  },

  // ========== 认证服务 ==========
  async login(phone, code) {
    return this.request('/auth', {
      action: 'login',
      phone,
      code
    });
  },

  async register(data) {
    return this.request('/auth', {
      action: 'register',
      ...data
    });
  },

  async sendCode(phone) {
    return this.request('/auth', {
      action: 'sendCode',
      phone
    });
  },

  // ========== 活动管理 ==========
  async getEvents(params = {}) {
    return this.request('/events', {
      action: 'list',
      page: 1,
      pageSize: 10,
      ...params
    });
  },

  async getEventDetail(eventId) {
    return this.request('/events', {
      action: 'detail',
      _id: eventId
    });
  },

  async createEvent(userId, activity) {
    return this.request('/events', {
      action: 'create',
      userId,
      activity
    });
  },

  async updateEvent(eventId, userId, activity) {
    return this.request('/events', {
      action: 'update',
      _id: eventId,
      userId,
      activity
    });
  },

  async deleteEvent(eventId, userId) {
    return this.request('/events', {
      action: 'delete',
      _id: eventId,
      userId
    });
  },

  // ========== 岗位管理 ==========
  async getJobs(params = {}) {
    return this.request('/jobs', {
      action: 'list',
      page: 1,
      pageSize: 10,
      ...params
    });
  },

  async getJobDetail(jobId) {
    return this.request('/jobs', {
      action: 'detail',
      _id: jobId
    });
  },

  async createJob(userId, job) {
    return this.request('/jobs', {
      action: 'create',
      userId,
      job
    });
  },

  async updateJob(jobId, userId, job) {
    return this.request('/jobs', {
      action: 'update',
      _id: jobId,
      userId,
      job
    });
  },

  async deleteJob(jobId, userId) {
    return this.request('/jobs', {
      action: 'delete',
      _id: jobId,
      userId
    });
  },

  // ========== 消息系统 ==========
  async getMessages(params = {}) {
    return this.request('/messages', {
      action: 'list',
      ...params
    });
  },

  async getMessageDetail(messageId) {
    return this.request('/messages', {
      action: 'detail',
      _id: messageId
    });
  },

  async createMessage(userId, message) {
    return this.request('/messages', {
      action: 'create',
      userId,
      message
    });
  },

  async updateMessage(messageId, userId, message) {
    return this.request('/messages', {
      action: 'update',
      _id: messageId,
      userId,
      message
    });
  },

  async deleteMessage(messageId, userId) {
    return this.request('/messages', {
      action: 'delete',
      _id: messageId,
      userId
    });
  },

  async markAsRead(messageId, userId) {
    return this.request('/messages', {
      action: 'markAsRead',
      _id: messageId,
      userId
    });
  }
};

// 导出到全局
window.CloudBaseAPI = CloudBaseAPI;
