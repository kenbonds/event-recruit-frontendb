// pages/jobs/detail.vue - 岗位详情页
<template>
  <view class="job-detail">
    <!-- 头部公司信息 -->
    <view class="header">
      <view class="company-info">
        <image 
          class="company-logo" 
          :src="job.companyLogo || '/static/company-default.png'" 
          mode="aspectFill"
        />
        <view class="company-text">
          <text class="job-title">{{ job.title }}</text>
          <text class="company-name">{{ job.company }}</text>
          <view class="job-tags">
            <text class="tag" v-for="tag in job.tags" :key="tag">{{ tag }}</text>
          </view>
        </view>
      </view>
      
      <view class="salary-section">
        <text class="salary">{{ job.salary }}</text>
        <text class="salary-tip">{{ job.salaryTip }}</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 基本信息 -->
      <view class="info-card">
        <view class="info-row">
          <text class="info-icon">📍</text>
          <text class="info-value">{{ job.location }}</text>
        </view>
        <view class="info-row">
          <text class="info-icon">🎓</text>
          <text class="info-value">{{ job.education }}</text>
        </view>
        <view class="info-row">
          <text class="info-icon">💼</text>
          <text class="info-value">{{ job.experience }}</text>
        </view>
        <view class="info-row">
          <text class="info-icon">👥</text>
          <text class="info-value">招聘 {{ job.recruitCount }} 人</text>
        </view>
      </view>

      <!-- 职位诱惑 -->
      <view class="section" v-if="job.benefits && job.benefits.length > 0">
        <text class="section-title">职位诱惑</text>
        <view class="benefits">
          <text class="benefit" v-for="b in job.benefits" :key="b">{{ b }}</text>
        </view>
      </view>

      <!-- 职位描述 -->
      <view class="section">
        <text class="section-title">职位描述</text>
        <view class="description" v-html="job.description"></view>
      </view>

      <!-- 工作地址 -->
      <view class="section">
        <text class="section-title">工作地址</text>
        <view class="address-section" @click="openMap">
          <text class="address">{{ job.address }}</text>
          <text class="map-tip">查看地图 ›</text>
        </view>
      </view>

      <!-- 公司介绍 -->
      <view class="section">
        <text class="section-title">公司介绍</text>
        <view class="company-desc">
          <text>{{ job.companyDesc }}</text>
        </view>
        <view class="company-tags">
          <view class="company-tag">
            <text class="tag-label">规模</text>
            <text class="tag-value">{{ job.companyScale }}</text>
          </view>
          <view class="company-tag">
            <text class="tag-label">行业</text>
            <text class="tag-value">{{ job.companyIndustry }}</text>
          </view>
          <view class="company-tag">
            <text class="tag-label">融资</text>
            <text class="tag-value">{{ job.companyFinance }}</text>
          </view>
        </view>
      </view>

      <!-- 相关活动 -->
      <view class="section" v-if="relatedEvents.length > 0">
        <text class="section-title">相关活动 ({{ relatedEvents.length }})</text>
        <scroll-view class="events-scroll" scroll-x>
          <view class="event-card" v-for="event in relatedEvents" :key="event.id" @click="goToEvent(event.id)">
            <image class="event-cover" :src="event.cover" mode="aspectFill" />
            <text class="event-title">{{ event.title }}</text>
            <text class="event-time">{{ event.time }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- 看过该职位的人也在看 -->
      <view class="section" v-if="similarJobs.length > 0">
        <text class="section-title">看过该职位的人也在看</text>
        <view class="similar-jobs">
          <view class="similar-job" v-for="j in similarJobs" :key="j.id" @click="goToJob(j.id)">
            <text class="similar-title">{{ j.title }}</text>
            <text class="similar-salary">{{ j.salary }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-left">
        <view class="action-item" @click="shareJob">
          <text class="icon">📤</text>
          <text>分享</text>
        </view>
        <view class="action-item" @click="toggleFavorite">
          <text class="icon">{{ isFavorite ? '❤️' : '🤍' }}</text>
          <text>{{ isFavorite ? '已收藏' : '收藏' }}</text>
        </view>
      </view>
      <button 
        class="apply-btn" 
        :class="{ applied: hasApplied }"
        @click="handleApply"
      >
        {{ hasApplied ? '已投递' : '立即投递' }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      jobId: null,
      job: {
        title: '',
        company: '',
        companyLogo: '',
        tags: [],
        salary: '',
        salaryTip: '',
        location: '',
        education: '',
        experience: '',
        recruitCount: 0,
        benefits: [],
        description: '',
        address: '',
        companyDesc: '',
        companyScale: '',
        companyIndustry: '',
        companyFinance: ''
      },
      relatedEvents: [],
      similarJobs: [],
      isFavorite: false,
      hasApplied: false
    }
  },
  onLoad(options) {
    if (options.id) {
      this.jobId = options.id
      this.loadJobDetail()
    }
  },
  methods: {
    async loadJobDetail() {
      uni.showLoading({ title: '加载中...' })
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/jobs/${this.jobId}`,
          method: 'GET'
        })
        if (res.data.code === 200) {
          this.job = res.data.data.job
          this.relatedEvents = res.data.data.relatedEvents || []
          this.similarJobs = res.data.data.similarJobs || []
          this.isFavorite = res.data.data.isFavorite || false
          this.hasApplied = res.data.data.hasApplied || false
        }
      } catch (e) {
        console.error('加载岗位详情失败:', e)
      } finally {
        uni.hideLoading()
      }
    },
    async toggleFavorite() {
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/jobs/favorite`,
          method: 'POST',
          data: { jobId: this.jobId }
        })
        if (res.data.code === 200) {
          this.isFavorite = !this.isFavorite
          uni.showToast({ title: this.isFavorite ? '已收藏' : '已取消' })
        }
      } catch (e) {
        console.error('收藏失败:', e)
      }
    },
    shareJob() {
      uni.showShareMenu({
        title: `${this.job.title} - ${this.job.company}`,
        path: `/pages/jobs/detail?id=${this.jobId}`
      })
    },
    openMap() {
      // 调用地图选择位置
      uni.openLocation({
        name: this.job.company,
        address: this.job.address,
        latitude: this.job.latitude,
        longitude: this.job.longitude,
        success: () => {}
      })
    },
    handleApply() {
      if (this.hasApplied) return
      
      uni.navigateTo({
        url: `/pages/jobs/apply?id=${this.jobId}`
      })
    },
    goToEvent(eventId) {
      uni.navigateTo({
        url: `/pages/events/detail?id=${eventId}`
      })
    },
    goToJob(jobId) {
      uni.navigateTo({
        url: `/pages/jobs/detail?id=${jobId}`
      })
    }
  }
}
</script>

<style scoped>
.job-detail {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 120rpx;
}

.header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 40rpx 30rpx;
}

.company-info {
  display: flex;
  margin-bottom: 30rpx;
}

.company-logo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
  background: #fff;
}

.company-text {
  flex: 1;
}

.job-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 8rpx;
}

.company-name {
  font-size: 28rpx;
  color: rgba(255,255,255,0.9);
  display: block;
  margin-bottom: 12rpx;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.tag {
  padding: 4rpx 12rpx;
  background: rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 4rpx;
  font-size: 22rpx;
}

.salary-section {
  background: rgba(255,255,255,0.15);
  border-radius: 12rpx;
  padding: 20rpx;
}

.salary {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 4rpx;
}

.salary-tip {
  font-size: 24rpx;
  color: rgba(255,255,255,0.8);
}

.content {
  padding: 30rpx;
}

.info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
}

.section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1a1a2e;
  display: block;
  margin-bottom: 16rpx;
}

.benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.benefit {
  padding: 8rpx 16rpx;
  background: #fff;
  border: 1rpx solid #667eea;
  color: #667eea;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.address-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.map-tip {
  font-size: 26rpx;
  color: #667eea;
}

.company-desc {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 16rpx;
}

.company-tags {
  display: flex;
  gap: 16rpx;
}

.company-tag {
  flex: 1;
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx;
  text-align: center;
}

.tag-label {
  font-size: 22rpx;
  color: #999;
  display: block;
  margin-bottom: 8rpx;
}

.tag-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}

.events-scroll {
  white-space: nowrap;
  margin: 0 -30rpx;
  padding: 0 30rpx;
}

.event-card {
  display: inline-block;
  width: 260rpx;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  margin-right: 16rpx;
}

.event-cover {
  width: 100%;
  height: 140rpx;
}

.event-title {
  font-size: 24rpx;
  color: #333;
  display: block;
  padding: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-time {
  font-size: 22rpx;
  color: #999;
  display: block;
  padding: 0 12rpx 12rpx;
}

.similar-jobs {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.similar-job {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.similar-job:last-child {
  border-bottom: none;
}

.similar-title {
  font-size: 28rpx;
  color: #333;
}

.similar-salary {
  font-size: 26rpx;
  color: #f97316;
  font-weight: bold;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
}

.action-left {
  display: flex;
  gap: 40rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22rpx;
  color: #666;
}

.icon {
  font-size: 36rpx;
  margin-bottom: 4rpx;
}

.apply-btn {
  flex: 1;
  margin-left: 30rpx;
  height: 72rpx;
  line-height: 72rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 36rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
}

.apply-btn.applied {
  background: #ccc;
}
</style>
