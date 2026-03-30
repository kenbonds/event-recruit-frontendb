// pages/mine/mine.vue - 个人中心页
<template>
  <view class="mine-page">
    <!-- 顶部用户信息 -->
    <view class="header">
      <view class="user-info" @click="goToProfile">
        <image 
          class="avatar" 
          :src="userInfo.avatar || '/static/default-avatar.png'" 
          mode="aspectFill"
        />
        <view class="info">
          <text class="nickname">{{ userInfo.nickname || '未登录' }}</text>
          <text class="bio" v-if="userInfo.bio">{{ userInfo.bio }}</text>
          <text class="login-tip" v-else>点击登录/注册</text>
        </view>
        <text class="arrow">›</text>
      </view>
      
      <!-- 统计数据 -->
      <view class="stats" v-if="isLoggedIn">
        <view class="stat-item">
          <text class="stat-num">{{ stats.activities }}</text>
          <text class="stat-label">参加活动</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.appliedJobs }}</text>
          <text class="stat-label">投递岗位</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.favorites }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.views }}</text>
          <text class="stat-label">看过我</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <text class="section-title">我的记录</text>
      <view class="menu-grid">
        <view class="menu-item" @click="goToPage('/pages/mine/my-activities')">
          <text class="menu-icon">🎪</text>
          <text class="menu-text">我的活动</text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/mine/my-jobs')">
          <text class="menu-icon">💼</text>
          <text class="menu-text">投递记录</text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/mine/favorites')">
          <text class="menu-icon">❤️</text>
          <text class="menu-text">我的收藏</text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/mine/resume')">
          <text class="menu-icon">📄</text>
          <text class="menu-text">我的简历</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <text class="section-title">通知消息</text>
      <view class="menu-grid">
        <view class="menu-item" @click="goToMessages('system')">
          <text class="menu-icon">🔔</text>
          <text class="menu-text">系统通知</text>
          <view class="badge" v-if="unreadCount.system > 0">{{ unreadCount.system }}</view>
        </view>
        <view class="menu-item" @click="goToMessages('activity')">
          <text class="menu-icon">🎪</text>
          <text class="menu-text">活动消息</text>
          <view class="badge" v-if="unreadCount.activity > 0">{{ unreadCount.activity }}</view>
        </view>
        <view class="menu-item" @click="goToMessages('job')">
          <text class="menu-icon">💼</text>
          <text class="menu-text">求职消息</text>
          <view class="badge" v-if="unreadCount.job > 0">{{ unreadCount.job }}</view>
        </view>
        <view class="menu-item" @click="goToMessages('互动')">
          <text class="menu-icon">💬</text>
          <text class="menu-text">互动消息</text>
          <view class="badge" v-if="unreadCount.interaction > 0">{{ unreadCount.interaction }}</view>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <text class="section-title">召集方</text>
      <view class="menu-list">
        <view class="menu-list-item" @click="goToOrganizer">
          <text class="menu-icon">🏢</text>
          <text class="menu-text">成为召集方</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-list-item" @click="goToPage('/pages/organizer/dashboard')" v-if="isOrganizer">
          <text class="menu-icon">📊</text>
          <text class="menu-text">召集方管理</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <text class="section-title">设置</text>
      <view class="menu-list">
        <view class="menu-list-item" @click="goToPage('/pages/mine/settings')">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">账号设置</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-list-item" @click="goToPage('/pages/mine/privacy')">
          <text class="menu-icon">🔒</text>
          <text class="menu-text">隐私设置</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-list-item" @click="goToPage('/pages/mine/about')">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <button 
      class="logout-btn" 
      v-if="isLoggedIn" 
      @click="handleLogout"
    >
      退出登录
    </button>

    <!-- 版本信息 -->
    <view class="version">
      <text>召集吧 v1.0.0</text>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      stats: {
        activities: 0,
        appliedJobs: 0,
        favorites: 0,
        views: 0
      },
      unreadCount: {
        system: 0,
        activity: 0,
        job: 0,
        interaction: 0
      },
      isOrganizer: false
    }
  },
  computed: {
    ...mapState(['userInfo']),
    isLoggedIn() {
      return this.userInfo && this.userInfo.id
    }
  },
  onShow() {
    if (this.isLoggedIn) {
      this.loadUserData()
    }
  },
  methods: {
    ...mapActions(['logout']),
    async loadUserData() {
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/users/profile`,
          method: 'GET'
        })
        if (res.data.code === 200) {
          this.stats = res.data.data.stats
          this.unreadCount = res.data.data.unreadCount
          this.isOrganizer = res.data.data.isOrganizer
        }
      } catch (e) {
        console.error('加载用户数据失败:', e)
      }
    },
    goToProfile() {
      if (this.isLoggedIn) {
        uni.navigateTo({ url: '/pages/mine/profile' })
      } else {
        uni.navigateTo({ url: '/pages/auth/login' })
      }
    },
    goToPage(url) {
      if (!this.isLoggedIn) {
        uni.navigateTo({ url: '/pages/auth/login' })
        return
      }
      uni.navigateTo({ url })
    },
    goToMessages(type) {
      if (!this.isLoggedIn) {
        uni.navigateTo({ url: '/pages/auth/login' })
        return
      }
      uni.navigateTo({ url: `/pages/messages/list?type=${type}` })
    },
    goToOrganizer() {
      if (!this.isLoggedIn) {
        uni.navigateTo({ url: '/pages/auth/login' })
        return
      }
      uni.navigateTo({ url: '/pages/organizer/apply' })
    },
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            this.logout()
            uni.showToast({ title: '已退出登录' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  background: #f5f6fa;
}

.header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 40rpx 30rpx 60rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255,255,255,0.3);
  margin-right: 24rpx;
}

.info {
  flex: 1;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 8rpx;
}

.bio {
  font-size: 26rpx;
  color: rgba(255,255,255,0.8);
  display: block;
}

.login-tip {
  font-size: 26rpx;
  color: rgba(255,255,255,0.7);
}

.arrow {
  font-size: 40rpx;
  color: rgba(255,255,255,0.7);
}

.stats {
  display: flex;
  justify-content: space-around;
  background: rgba(255,255,255,0.15);
  border-radius: 16rpx;
  padding: 24rpx 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255,255,255,0.8);
}

.menu-section {
  margin: 20rpx 0;
  padding: 0 20rpx;
}

.section-title {
  font-size: 26rpx;
  color: #999;
  display: block;
  margin-bottom: 16rpx;
  padding-left: 10rpx;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.menu-icon {
  font-size: 44rpx;
  margin-bottom: 10rpx;
}

.menu-text {
  font-size: 24rpx;
  color: #333;
}

.badge {
  position: absolute;
  top: -5rpx;
  right: 10rpx;
  background: #ff4d4f;
  color: #fff;
  font-size: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
  border-radius: 16rpx;
  padding: 0 8rpx;
}

.menu-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-list-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-list-item:last-child {
  border-bottom: none;
}

.menu-list-item .menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
  margin-bottom: 0;
}

.menu-list-item .menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.menu-list-item .arrow {
  color: #ccc;
}

.logout-btn {
  margin: 40rpx 20rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #fff;
  color: #ff4d4f;
  border-radius: 16rpx;
  font-size: 30rpx;
  border: none;
}

.version {
  text-align: center;
  padding: 40rpx;
  color: #ccc;
  font-size: 24rpx;
}
</style>
