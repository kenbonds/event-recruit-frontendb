// pages/events/detail.vue - 活动详情页
<template>
  <view class="event-detail">
    <!-- 封面图 -->
    <view class="cover-wrapper">
      <image 
        class="cover-image" 
        :src="event.coverImage || '/static/event-cover.png'" 
        mode="aspectFill"
      />
      <view class="cover-gradient"></view>
      <view class="status-tag" :class="event.status">
        {{ getStatusText(event.status) }}
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 标题 -->
      <view class="title-section">
        <text class="title">{{ event.title }}</text>
        <view class="tags">
          <text class="tag" v-for="tag in event.tags" :key="tag">{{ tag }}</text>
        </view>
      </view>

      <!-- 基本信息 -->
      <view class="info-card">
        <view class="info-row">
          <text class="info-label">📅 时间</text>
          <text class="info-value">{{ event.startTime }} - {{ event.endTime }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">📍 地点</text>
          <text class="info-value">{{ event.location }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">👤 主办方</text>
          <text class="info-value">{{ event.organizer }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">👥 人数</text>
          <text class="info-value">{{ event.currentParticipants }}/{{ event.maxParticipants }}人</text>
        </view>
      </view>

      <!-- 活动介绍 -->
      <view class="section">
        <text class="section-title">活动介绍</text>
        <text class="description">{{ event.description }}</text>
      </view>

      <!-- 相关岗位 -->
      <view class="section" v-if="relatedJobs.length > 0">
        <text class="section-title">相关岗位 ({{ relatedJobs.length }})</text>
        <scroll-view class="jobs-scroll" scroll-x>
          <view class="job-card" v-for="job in relatedJobs" :key="job.id" @click="goToJob(job.id)">
            <text class="job-title">{{ job.title }}</text>
            <text class="job-company">{{ job.company }}</text>
            <text class="job-salary">{{ job.salary }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- 参与者 -->
      <view class="section" v-if="participants.length > 0">
        <text class="section-title">参与者 ({{ participants.length }})</text>
        <view class="participants-grid">
          <view class="participant" v-for="p in participants" :key="p.id">
            <image class="avatar" :src="p.avatar || '/static/default-avatar.png'" />
            <text class="name">{{ p.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-left">
        <view class="action-item" @click="shareEvent">
          <text class="icon">📤</text>
          <text>分享</text>
        </view>
        <view class="action-item" @click="toggleFavorite">
          <text class="icon">{{ isFavorite ? '❤️' : '🤍' }}</text>
          <text>{{ isFavorite ? '已收藏' : '收藏' }}</text>
        </view>
      </view>
      <button 
        class="join-btn" 
        :class="{ disabled: !canJoin }"
        @click="joinEvent"
      >
        {{ canJoin ? '立即报名' : getJoinBtnText() }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      eventId: null,
      event: {
        title: '',
        coverImage: '',
        status: 'upcoming',
        tags: [],
        startTime: '',
        endTime: '',
        location: '',
        organizer: '',
        currentParticipants: 0,
        maxParticipants: 100,
        description: ''
      },
      relatedJobs: [],
      participants: [],
      isFavorite: false
    }
  },
  computed: {
    canJoin() {
      if (this.event.status === 'ended') return false
      if (this.event.currentParticipants >= this.event.maxParticipants) return false
      return true
    }
  },
  onLoad(options) {
    if (options.id) {
      this.eventId = options.id
      this.loadEventDetail()
    }
  },
  methods: {
    getStatusText(status) {
      const map = {
        upcoming: '即将开始',
        ongoing: '进行中',
        ended: '已结束'
      }
      return map[status] || status
    },
    getJoinBtnText() {
      if (this.event.status === 'ended') return '已结束'
      if (this.event.currentParticipants >= this.event.maxParticipants) return '名额已满'
      return '不可报名'
    },
    async loadEventDetail() {
      uni.showLoading({ title: '加载中...' })
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/events/${this.eventId}`,
          method: 'GET'
        })
        if (res.data.code === 200) {
          this.event = res.data.data.event
          this.relatedJobs = res.data.data.relatedJobs || []
          this.participants = res.data.data.participants || []
          this.isFavorite = res.data.data.isFavorite || false
        }
      } catch (e) {
        console.error('加载活动详情失败:', e)
      } finally {
        uni.hideLoading()
      }
    },
    goToJob(jobId) {
      uni.navigateTo({
        url: `/pages/jobs/detail?id=${jobId}`
      })
    },
    async toggleFavorite() {
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/events/favorite`,
          method: 'POST',
          data: { eventId: this.eventId }
        })
        if (res.data.code === 200) {
          this.isFavorite = !this.isFavorite
          uni.showToast({ title: this.isFavorite ? '已收藏' : '已取消' })
        }
      } catch (e) {
        console.error('收藏失败:', e)
      }
    },
    shareEvent() {
      uni.showShareMenu({
        title: this.event.title,
        path: `/pages/events/detail?id=${this.eventId}`
      })
    },
    async joinEvent() {
      if (!this.canJoin) return
      
      uni.showModal({
        title: '确认报名',
        content: `确定要报名「${this.event.title}」吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const res = await uni.request({
                url: `${this.$apiUrl}/events/join`,
                method: 'POST',
                data: { eventId: this.eventId }
              })
              if (res.data.code === 200) {
                uni.showToast({ title: '报名成功！' })
                this.loadEventDetail()
              } else {
                uni.showToast({ title: res.data.message, icon: 'none' })
              }
            } catch (e) {
              uni.showToast({ title: '报名失败', icon: 'none' })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.event-detail {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 120rpx;
}

.cover-wrapper {
  position: relative;
  height: 400rpx;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.cover-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  background: linear-gradient(transparent, rgba(0,0,0,0.5));
}

.status-tag {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #fff;
}

.status-tag.upcoming { background: #667eea; }
.status-tag.ongoing { background: #22c55e; }
.status-tag.ended { background: #94a3b8; }

.content {
  padding: 30rpx;
}

.title-section {
  margin-bottom: 30rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #1a1a2e;
  display: block;
  margin-bottom: 16rpx;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag {
  padding: 6rpx 16rpx;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  color: #667eea;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
}

.info-row {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  width: 140rpx;
  color: #666;
  font-size: 28rpx;
}

.info-value {
  flex: 1;
  color: #333;
  font-size: 28rpx;
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

.description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.jobs-scroll {
  white-space: nowrap;
  margin: 0 -30rpx;
  padding: 0 30rpx;
}

.job-card {
  display: inline-block;
  width: 280rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-right: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.job-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.job-company {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.job-salary {
  font-size: 26rpx;
  color: #f97316;
  font-weight: 500;
}

.participants-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.participant {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-bottom: 8rpx;
}

.name {
  font-size: 22rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100rpx;
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

.join-btn {
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

.join-btn.disabled {
  background: #ccc;
}
</style>
