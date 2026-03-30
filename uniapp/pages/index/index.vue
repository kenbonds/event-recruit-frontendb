<template>
  <view class="page">
    <!-- 头部 -->
    <view class="header">
      <view class="logo">
        <text class="title">召集吧</text>
        <text class="subtitle">活动招聘双向导流平台</text>
      </view>
      <view class="search-bar" @click="goSearch">
        <text class="icon">🔍</text>
        <text class="placeholder">搜索活动/岗位</text>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-entry">
      <view class="entry-item" @click="goEvents">
        <view class="entry-icon events">📅</view>
        <text>活动</text>
      </view>
      <view class="entry-item" @click="goJobs">
        <view class="entry-icon jobs">💼</view>
        <text>岗位</text>
      </view>
      <view class="entry-item" @click="goMessages">
        <view class="entry-icon messages">💬</view>
        <text>消息</text>
      </view>
      <view class="entry-item" @click="goProfile">
        <view class="entry-icon profile">👤</view>
        <text>我的</text>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="num">{{ stats.events || 0 }}</text>
        <text class="label">活动总数</text>
      </view>
      <view class="stat-item">
        <text class="num">{{ stats.jobs || 0 }}</text>
        <text class="label">岗位总数</text>
      </view>
      <view class="stat-item">
        <text class="num">{{ stats.users || 0 }}</text>
        <text class="label">用户总数</text>
      </view>
    </view>

    <!-- 推荐活动 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">推荐活动</text>
        <text class="more" @click="goEvents">更多 →</text>
      </view>
      <scroll-view class="events-scroll" scroll-x>
        <view 
          class="event-card" 
          v-for="item in events" 
          :key="item._id"
          @click="goEventDetail(item._id)"
        >
          <view class="event-cover">
            <text class="event-emoji">{{ getEventEmoji(item.type) }}</text>
          </view>
          <view class="event-info">
            <text class="event-title">{{ item.title }}</text>
            <text class="event-meta">{{ item.startTime?.slice(0, 10) }} · {{ item.location || '线上' }}</text>
            <view class="event-tags">
              <text class="tag">{{ item.type }}</text>
            </view>
          </view>
        </view>
        <view class="empty" v-if="events.length === 0">
          <text>暂无推荐活动</text>
        </view>
      </scroll-view>
    </view>

    <!-- 推荐岗位 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">推荐岗位</text>
        <text class="more" @click="goJobs">更多 →</text>
      </view>
      <view class="jobs-list">
        <view 
          class="job-card" 
          v-for="item in jobs" 
          :key="item._id"
          @click="goJobDetail(item._id)"
        >
          <view class="job-top">
            <text class="job-title">{{ item.title }}</text>
            <text class="job-salary">{{ item.salary || '面议' }}</text>
          </view>
          <view class="job-company">
            <text>{{ item.company }}</text>
            <text class="badge" v-if="item.verified">认证</text>
          </view>
          <view class="job-tags">
            <text class="tag">{{ item.city || '全国' }}</text>
            <text class="tag">{{ item.type || '全职' }}</text>
          </view>
        </view>
        <view class="empty" v-if="jobs.length === 0">
          <text>暂无推荐岗位</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { eventsAPI, jobsAPI, analyticsAPI } from '@/utils/api.js'

export default {
  data() {
    return {
      stats: {
        events: 0,
        jobs: 0,
        users: 0
      },
      events: [],
      jobs: []
    }
  },
  onLoad() {
    this.loadData()
  },
  onShow() {
    // 刷新用户登录状态
    const userInfo = uni.getStorageSync('userInfo')
    if (!userInfo) {
      // 未登录也显示公开数据
    }
  },
  methods: {
    async loadData() {
      try {
        // 获取统计数据
        const statsRes = await analyticsAPI.getOverview()
        if (statsRes && statsRes.total_events !== undefined) {
          this.stats.events = statsRes.total_events || 0
          this.stats.jobs = statsRes.total_jobs || 0
          this.stats.users = statsRes.total_users || 0
        } else {
          // 如果API格式不对，使用旧逻辑
          console.log('统计API返回格式异常，使用旧逻辑')
        }
        
        // 获取活动列表
        const eventsRes = await eventsAPI.getList({ page: 1, limit: 10 })
        this.events = eventsRes.list || eventsRes || []
        
        // 获取岗位列表
        const jobsRes = await jobsAPI.getList({ page: 1, limit: 10 })
        this.jobs = jobsRes.list || jobsRes || []
        
        // 如果统计API失败，使用列表数据作为后备
        if (!statsRes || statsRes.total_events === undefined) {
          this.stats.events = this.events.length
          this.stats.jobs = this.jobs.length
          this.stats.users = 0  // 用户数据无法从列表获取
        }
      } catch (e) {
        console.error('加载数据失败:', e)
        // 使用模拟数据作为最后的后备
        this.stats = {
          events: 20,
          jobs: 165,
          users: 0
        }
        this.events = [
          { _id: '1', title: '腾讯2026春季校园招聘宣讲会', type: '宣讲会', startTime: '2026-04-15', location: '北京大学' },
          { _id: '2', title: '上海高校联合双选会', type: '双选会', startTime: '2026-04-20', location: '上海体育馆' },
          { _id: '3', title: '互联网产品经理大赛', type: '比赛', startTime: '2026-05-01', location: '线上' }
        ]
        this.jobs = [
          { _id: '1', title: '前端开发工程师', salary: '15K-25K', company: '字节跳动', city: '北京', type: '全职', verified: true },
          { _id: '2', title: '产品经理实习', salary: '200-300/天', company: '腾讯', city: '深圳', type: '实习', verified: true },
          { _id: '3', title: 'Java开发工程师', salary: '20K-35K', company: '阿里巴巴', city: '杭州', type: '全职', verified: true }
        ]
      }
    },
    getEventEmoji(type) {
      const map = {
        '宣讲会': '🎤',
        '双选会': '🤝',
        '比赛': '🏆',
        '其他': '📌'
      }
      return map[type] || '📌'
    },
    goSearch() {
      uni.navigateTo({
        url: '/pages/search/search'
      })
    },
    goEvents() {
      uni.switchTab({
        url: '/pages/events/events'
      })
    },
    goJobs() {
      uni.switchTab({
        url: '/pages/jobs/jobs'
      })
    },
    goMessages() {
      uni.switchTab({
        url: '/pages/messages/messages'
      })
    },
    goProfile() {
      uni.switchTab({
        url: '/pages/mine/mine'
      })
    },
    goEventDetail(id) {
      uni.navigateTo({
        url: `/pages/event-detail/event-detail?id=${id}`
      })
    },
    goJobDetail(id) {
      uni.navigateTo({
        url: `/pages/job-detail/job-detail?id=${id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 20rpx;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30rpx;
  padding-top: 80rpx;
  color: #fff;
}

.logo {
  margin-bottom: 24rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  display: block;
}

.subtitle {
  font-size: 24rpx;
  opacity: 0.8;
}

.search-bar {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  color: #999;
}

.search-bar .icon {
  margin-right: 16rpx;
}

.placeholder {
  font-size: 28rpx;
}

.quick-entry {
  display: flex;
  background: #fff;
  margin: -30rpx 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.entry-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #666;
}

.entry-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-bottom: 12rpx;
}

.entry-icon.events { background: #ede9ff; }
.entry-icon.jobs { background: #edfbf5; }
.entry-icon.messages { background: #fff4ef; }
.entry-icon.profile { background: #e0f2fe; }

.stats-card {
  display: flex;
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-item .num {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #667eea;
}

.stat-item .label {
  font-size: 24rpx;
  color: #999;
}

.section {
  margin: 0 30rpx 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more {
  font-size: 26rpx;
  color: #667eea;
}

.events-scroll {
  white-space: nowrap;
}

.event-card {
  display: inline-block;
  width: 320rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-right: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  vertical-align: top;
}

.event-cover {
  height: 140rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-emoji {
  font-size: 60rpx;
}

.event-info {
  padding: 20rpx;
}

.event-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-meta {
  font-size: 22rpx;
  color: #999;
  margin: 8rpx 0;
}

.event-tags .tag {
  font-size: 20rpx;
  color: #667eea;
  background: #ede9ff;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.jobs-list {
  background: #fff;
  border-radius: 16rpx;
  padding: 10rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.job-card {
  padding: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.job-card:last-child {
  border-bottom: none;
}

.job-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.job-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.job-salary {
  font-size: 28rpx;
  font-weight: 600;
  color: #f97316;
}

.job-company {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.badge {
  font-size: 20rpx;
  color: #19c37d;
  background: #edfbf5;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
}

.job-tags {
  display: flex;
  gap: 10rpx;
}

.job-tags .tag {
  font-size: 22rpx;
  color: #666;
  background: #f5f6fa;
  padding: 6rpx 14rpx;
  border-radius: 8rpx;
}

.empty {
  padding: 60rpx;
  text-align: center;
  color: #999;
  font-size: 26rpx;
}
</style>
