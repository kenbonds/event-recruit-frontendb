/**
 * API 请求封装
 * 对接腾讯云后端 API
 */

const BASE_URL = 'https://zhaojiba1-0gqnm5h075fc5ccf-1300229407.ap-shanghai.app.tcloudbase.com/api/v1'

/**
 * 发起请求
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    const userInfo = uni.getStorageSync('userInfo')
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'X-User-Id': userInfo?._id || '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = res.data
          if (data.code === 0 || data.success) {
            resolve(data.data || data)
          } else {
            uni.showToast({
              title: data.message || '请求失败',
              icon: 'none'
            })
            reject(data)
          }
        } else if (res.statusCode === 401) {
          // token过期
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/auth/login'
            })
          }, 1500)
          reject(new Error('未授权'))
        } else {
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          })
          reject(res.data)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

export default {
  // GET 请求
  get: (url, data) => request({ url, method: 'GET', data }),
  
  // POST 请求
  post: (url, data) => request({ url, method: 'POST', data }),
  
  // PUT 请求
  put: (url, data) => request({ url, method: 'PUT', data }),
  
  // DELETE 请求
  delete: (url, data) => request({ url, method: 'DELETE', data }),
}

// ==================== API 接口 ====================

// 认证相关
export const authAPI = {
  // 发送验证码
  sendCode: (phone) => request({
    url: '/auth/sendCode',
    method: 'POST',
    data: { phone }
  }),
  
  // 手机号登录
  login: (phone, code) => request({
    url: '/auth/login',
    method: 'POST',
    data: { phone, code }
  }),
  
  // 注册
  register: (phone, code, nickname, userType) => request({
    url: '/auth/register',
    method: 'POST',
    data: { phone, code, nickname, userType }
  }),
  
  // 微信登录
  wxLogin: (code) => request({
    url: '/auth/wxLogin',
    method: 'POST',
    data: { code }
  }),
  
  // 获取用户信息
  getUserInfo: () => request({
    url: '/auth/userInfo',
    method: 'GET'
  }),
  
  // 更新用户信息
  updateUserInfo: (data) => request({
    url: '/auth/update',
    method: 'PUT',
    data
  }),
}

// 活动相关
export const eventsAPI = {
  // 获取活动列表
  getList: (params) => request({
    url: '/events',
    method: 'GET',
    data: params
  }),
  
  // 获取活动详情
  getDetail: (id) => request({
    url: `/events/${id}`,
    method: 'GET'
  }),
  
  // 报名活动
  apply: (id) => request({
    url: `/events/${id}/apply`,
    method: 'POST'
  }),
  
  // 取消报名
  cancelApply: (id) => request({
    url: `/events/${id}/cancel`,
    method: 'POST'
  }),
  
  // 获取我报名的活动
  getMyEvents: () => request({
    url: '/events/my',
    method: 'GET'
  }),
  
  // 收藏活动
  collect: (id) => request({
    url: `/events/${id}/collect`,
    method: 'POST'
  }),
}

// 岗位相关
export const jobsAPI = {
  // 获取岗位列表
  getList: (params) => request({
    url: '/jobs',
    method: 'GET',
    data: params
  }),
  
  // 获取岗位详情
  getDetail: (id) => request({
    url: `/jobs/${id}`,
    method: 'GET'
  }),
  
  // 投递简历
  apply: (id, data) => request({
    url: `/jobs/${id}/apply`,
    method: 'POST',
    data
  }),
  
  // 获取我投递的岗位
  getMyApplications: () => request({
    url: '/jobs/my',
    method: 'GET'
  }),
  
  // 收藏岗位
  collect: (id) => request({
    url: `/jobs/${id}/collect`,
    method: 'POST'
  }),
}

// 消息相关
export const messagesAPI = {
  // 获取消息列表
  getList: (params) => request({
    url: '/messages',
    method: 'GET',
    data: params
  }),
  
  // 标记已读
  markRead: (id) => request({
    url: `/messages/${id}/read`,
    method: 'POST'
  }),
  
  // 获取未读数
  getUnreadCount: () => request({
    url: '/messages/unread',
    method: 'GET'
  }),
}

// 匹配相关
export const matchAPI = {
  // 获取推荐
  getRecommendations: (type) => request({
    url: '/match/recommend',
    method: 'GET',
    data: { type }
  }),
  
  // 获取匹配分数
  getMatchScore: (jobId) => request({
    url: `/match/score/${jobId}`,
    method: 'GET'
  }),
}

// 爬虫相关
export const crawlerAPI = {
  // 手动触发抓取
  trigger: (data) => request({
    url: '/crawler/trigger',
    method: 'POST',
    data
  }),
  
  // 获取抓取状态
  getStats: () => request({
    url: '/crawler/stats',
    method: 'GET'
  }),
}

// 统计相关
export const analyticsAPI = {
  // 获取全局概览
  getOverview: () => request({
    url: '/analytics/overview',
    method: 'GET'
  }),
  
  // 获取用户增长趋势
  getUserGrowth: (days = 30) => request({
    url: '/analytics/user-growth',
    method: 'GET',
    data: { days }
  }),
  
  // 获取事件统计
  getEventStats: () => request({
    url: '/analytics/event-stats',
    method: 'GET'
  }),
}
