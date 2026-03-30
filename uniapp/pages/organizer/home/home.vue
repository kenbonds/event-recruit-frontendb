// pages/organizer/home.vue - 召集方首页
<template>
  <view class="organizer-home">
    <!-- 未认证状态 -->
    <view class="not-certified" v-if="!isCertified">
      <view class="certify-card">
        <text class="certify-icon">🏢</text>
        <text class="certify-title">成为召集方</text>
        <text class="certify-desc">发布活动、招聘人才，让你的组织更具影响力</text>
        <button class="certify-btn" @click="goToCertify">立即认证</button>
      </view>
    </view>

    <!-- 已认证状态 -->
    <view class="home-content" v-else>
      <!-- 企业信息 -->
      <view class="company-header">
        <image class="company-logo" :src="companyInfo.logo || '/static/company-default.png'" />
        <view class="company-info">
          <text class="company-name">{{ companyInfo.name }}</text>
          <text class="company-status">已认证</text>
        </view>
      </view>

      <!-- 数据统计 -->
      <view class="stats-section">
        <view class="stats-card">
          <view class="stat-item">
            <text class="stat-num">{{ stats.totalEvents }}</text>
            <text class="stat-label">活动总数</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ stats.totalJobs }}</text>
            <text class="stat-label">岗位总数</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ stats.totalApplicants }}</text>
            <text class="stat-label">总申请人</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ stats.totalViews }}</text>
            <text class="stat-label">总浏览量</text>
          </view>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="quick-actions">
        <text class="section-title">发布</text>
        <view class="action-grid">
          <view class="action-item" @click="goToPublishEvent">
            <view class="action-icon event">
              <text>🎪</text>
            </view>
            <text class="action-text">发布活动</text>
          </view>
          <view class="action-item" @click="goToPublishJob">
            <view class="action-icon job">
              <text>💼</text>
            </view>
            <text class="action-text">发布岗位</text>
          </view>
          <view class="action-item" @click="goToMyPosts">
            <view class="action-icon manage">
              <text>📋</text>
            </view>
            <text class="action-text">我的发布</text>
          </view>
          <view class="action-item" @click="goToApplicants">
            <view class="action-icon applicant">
              <text>👥</text>
            </view>
            <text class="action-text">申请人</text>
          </view>
        </view>
      </view>

      <!-- 最近动态 -->
      <view class="recent-section">
        <text class="section-title">最近动态</text>
        <view class="activity-list">
          <view class="activity-item" v-for="item in recentActivities" :key="item.id">
            <view class="activity-icon" :class="item.type">
              <text>{{ item.type === 'event' ? '🎪' : '💼' }}</text>
            </view>
            <view class="activity-content">
              <text class="activity-title">{{ item.title }}</text>
              <text class="activity-desc">{{ item.description }}</text>
            </view>
            <text class="activity-time">{{ item.time }}</text>
          </view>
          <view class="empty-activity" v-if="recentActivities.length === 0">
            <text>暂无动态</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isCertified: false,
      companyInfo: {
        name: '',
        logo: ''
      },
      stats: {
        totalEvents: 0,
        totalJobs: 0,
        totalApplicants: 0,
        totalViews: 0
      },
      recentActivities: []
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/organizer/home`,
          method: 'GET'
        })
        if (res.data.code === 200) {
          this.isCertified = res.data.data.isCertified
          this.companyInfo = res.data.data.companyInfo || {}
          this.stats = res.data.data.stats || {}
          this.recentActivities = res.data.data.recentActivities || []
        }
      } catch (e) {
        console.error('加载召集方首页失败:', e)
      }
    },
    goToCertify() {
      uni.navigateTo({ url: '/pages/organizer/certify' })
    },
    goToPublishEvent() {
      uni.navigateTo({ url: '/pages/organizer/publish-event' })
    },
    goToPublishJob() {
      uni.navigateTo({ url: '/pages/organizer/publish-job' })
    },
    goToMyPosts() {
      uni.navigateTo({ url: '/pages/organizer/my-posts' })
    },
    goToApplicants() {
      uni.navigateTo({ url: '/pages/organizer/applicants' })
    }
  }
}
</script>

<style scoped>
.organizer-home {
  min-height: 100vh;
  background: #f5f6fa;
}

.not-certified {
  padding: 40rpx;
}

.certify-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  box-shadow: 0 8rpx 40rpx rgba(102, 126, 234, 0.15);
}

.certify-icon {
  font-size: 100rpx;
  display: block;
  margin-bottom: 30rpx;
}

.certify-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #1a1a2e;
  display: block;
  margin-bottom: 16rpx;
}

.certify-desc {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 40rpx;
}

.certify-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: bold;
  border: none;
}

.home-content {
  padding: 20rpx;
}

.company-header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.company-logo {
  width: 100rpx;
  height: 100rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
  background: #fff;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 8rpx;
}

.company-status {
  font-size: 24rpx;
  color: rgba(255,255,255,0.8);
}

.stats-section {
  margin-bottom: 20rpx;
}

.stats-card {
  display: flex;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-num {
  font-size: 36rpx;
  font-weight: bold;
  color: #667eea;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.quick-actions {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1a1a2e;
  display: block;
  margin-bottom: 20rpx;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  margin-bottom: 12rpx;
}

.action-icon.event {
  background: linear-gradient(135deg, #667eea20, #764ba220);
}

.action-icon.job {
  background: linear-gradient(135deg, #f9731620, #ea580c20);
}

.action-icon.manage {
  background: linear-gradient(135deg, #22c55e20, #16a34a20);
}

.action-icon.applicant {
  background: linear-gradient(135deg, #8b5cf620, #7c3aed20);
}

.action-text {
  font-size: 24rpx;
  color: #333;
}

.recent-section {
  margin-bottom: 20rpx;
}

.activity-list {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  margin-right: 20rpx;
}

.activity-icon.event {
  background: #667eea20;
}

.activity-icon.job {
  background: #f9731620;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 4rpx;
}

.activity-desc {
  font-size: 24rpx;
  color: #999;
}

.activity-time {
  font-size: 22rpx;
  color: #ccc;
}

.empty-activity {
  padding: 60rpx;
  text-align: center;
  color: #999;
  font-size: 26rpx;
}
</style>
