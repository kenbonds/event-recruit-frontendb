// pages/messages/list.vue - 消息列表页
<template>
  <view class="messages-page">
    <!-- 顶部标签 -->
    <view class="tabs">
      <view 
        class="tab" 
        :class="{ active: currentTab === 'all' }"
        @click="switchTab('all')"
      >
        全部
      </view>
      <view 
        class="tab" 
        :class="{ active: currentTab === 'system' }"
        @click="switchTab('system')"
      >
        系统
      </view>
      <view 
        class="tab" 
        :class="{ active: currentTab === 'activity' }"
        @click="switchTab('activity')"
      >
        活动
      </view>
      <view 
        class="tab" 
        :class="{ active: currentTab === 'job' }"
        @click="switchTab('job')"
      >
        求职
      </view>
      <view 
        class="tab" 
        :class="{ active: currentTab === 'interaction' }"
        @click="switchTab('interaction')"
      >
        互动
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view 
      class="message-list" 
      scroll-y 
      @scrolltolower="loadMore"
    >
      <view 
        class="message-item" 
        v-for="msg in messages" 
        :key="msg.id"
        :class="{ unread: !msg.isRead }"
        @click="goToDetail(msg)"
      >
        <!-- 左侧图标 -->
        <view class="msg-icon">
          <image :src="getTypeIcon(msg.type)" mode="aspectFill" />
          <view class="unread-dot" v-if="!msg.isRead"></view>
        </view>
        
        <!-- 中间内容 -->
        <view class="msg-content">
          <view class="msg-header">
            <text class="msg-title">{{ msg.title }}</text>
            <text class="msg-time">{{ formatTime(msg.createTime) }}</text>
          </view>
          <text class="msg-text">{{ msg.content }}</text>
        </view>
        
        <!-- 右侧封面图 -->
        <image 
          class="msg-cover" 
          v-if="msg.cover" 
          :src="msg.cover" 
          mode="aspectFill"
        />
      </view>

      <!-- 空状态 -->
      <view class="empty" v-if="messages.length === 0">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无消息</text>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="messages.length > 0">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'all',
      messages: [],
      page: 1,
      pageSize: 20,
      loading: false,
      noMore: false
    }
  },
  onLoad(options) {
    if (options.type) {
      this.currentTab = options.type
    }
    this.loadMessages()
  },
  onPullDownRefresh() {
    this.page = 1
    this.noMore = false
    this.loadMessages().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab
      this.page = 1
      this.noMore = false
      this.loadMessages()
    },
    async loadMessages() {
      if (this.loading) return
      this.loading = true
      
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/messages`,
          method: 'GET',
          data: {
            type: this.currentTab === 'all' ? undefined : this.currentTab,
            page: this.page,
            pageSize: this.pageSize
          }
        })
        
        if (res.data.code === 200) {
          const list = res.data.data.list
          if (this.page === 1) {
            this.messages = list
          } else {
            this.messages = [...this.messages, ...list]
          }
          this.noMore = list.length < this.pageSize
        }
      } catch (e) {
        console.error('加载消息失败:', e)
      } finally {
        this.loading = false
      }
    },
    loadMore() {
      if (!this.noMore && !this.loading) {
        this.page++
        this.loadMessages()
      }
    },
    getTypeIcon(type) {
      const icons = {
        system: '/static/icons/msg-system.png',
        activity: '/static/icons/msg-activity.png',
        job: '/static/icons/msg-job.png',
        interaction: '/static/icons/msg-interaction.png'
      }
      return icons[type] || '/static/icons/msg-default.png'
    },
    formatTime(time) {
      const date = new Date(time)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return '刚刚'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
      if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
      
      return `${date.getMonth() + 1}-${date.getDate()}`
    },
    goToDetail(msg) {
      // 标记已读
      if (!msg.isRead) {
        this.markAsRead(msg.id)
      }
      
      // 根据消息类型跳转
      if (msg.targetType === 'event') {
        uni.navigateTo({ url: `/pages/events/detail?id=${msg.targetId}` })
      } else if (msg.targetType === 'job') {
        uni.navigateTo({ url: `/pages/jobs/detail?id=${msg.targetId}` })
      } else if (msg.targetType === 'application') {
        uni.navigateTo({ url: `/pages/mine/my-jobs` })
      } else {
        uni.navigateTo({ url: `/pages/messages/detail?id=${msg.id}` })
      }
    },
    async markAsRead(msgId) {
      try {
        await uni.request({
          url: `${this.$apiUrl}/messages/read`,
          method: 'POST',
          data: { messageId: msgId }
        })
        
        // 更新本地状态
        const msg = this.messages.find(m => m.id === msgId)
        if (msg) msg.isRead = true
      } catch (e) {
        console.error('标记已读失败:', e)
      }
    }
  }
}
</script>

<style scoped>
.messages-page {
  min-height: 100vh;
  background: #f5f6fa;
}

.tabs {
  display: flex;
  background: #fff;
  padding: 0 20rpx;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab.active {
  color: #667eea;
  font-weight: bold;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #667eea;
  border-radius: 2rpx;
}

.message-list {
  height: calc(100vh - 88rpx);
}

.message-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.message-item.unread {
  background: #f8f9ff;
}

.msg-icon {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.msg-icon image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.unread-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 16rpx;
  height: 16rpx;
  background: #ff4d4f;
  border-radius: 50%;
  border: 2rpx solid #fff;
}

.msg-content {
  flex: 1;
  min-width: 0;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.msg-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.unread .msg-title {
  color: #1a1a2e;
}

.msg-time {
  font-size: 24rpx;
  color: #999;
}

.msg-text {
  font-size: 26rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.msg-cover {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  margin-left: 16rpx;
  flex-shrink: 0;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.load-more {
  text-align: center;
  padding: 30rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
