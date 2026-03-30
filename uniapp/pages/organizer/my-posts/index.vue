// pages/organizer/my-posts.vue - 我的发布管理页
<template>
  <view class="my-posts">
    <!-- 标签切换 -->
    <view class="tabs">
      <view 
        class="tab" 
        :class="{ active: currentTab === 'events' }"
        @click="switchTab('events')"
      >
        活动 ({{ stats.eventCount }})
      </view>
      <view 
        class="tab" 
        :class="{ active: currentTab === 'jobs' }"
        @click="switchTab('jobs')"
      >
        岗位 ({{ stats.jobCount }})
      </view>
    </view>

    <!-- 状态筛选 -->
    <view class="filter-bar">
      <view 
        class="filter-item" 
        :class="{ active: statusFilter === 'all' }"
        @click="switchStatus('all')"
      >
        全部
      </view>
      <view 
        class="filter-item" 
        :class="{ active: statusFilter === 'published' }"
        @click="switchStatus('published')"
      >
        已发布
      </view>
      <view 
        class="filter-item" 
        :class="{ active: statusFilter === 'draft' }"
        @click="switchStatus('draft')"
      >
        草稿
      </view>
      <view 
        class="filter-item" 
        :class="{ active: statusFilter === 'ended' }"
        @click="switchStatus('ended')"
      >
        已结束
      </view>
    </view>

    <!-- 列表 -->
    <scroll-view 
      class="post-list" 
      scroll-y 
      @scrolltolower="loadMore"
    >
      <!-- 活动列表 -->
      <view v-if="currentTab === 'events'" class="list-content">
        <view 
          class="post-card" 
          v-for="item in list" 
          :key="item.id"
        >
          <image 
            class="post-cover" 
            :src="item.cover" 
            mode="aspectFill" 
          />
          <view class="post-info">
            <text class="post-title">{{ item.title }}</text>
            <view class="post-meta">
              <text class="post-status" :class="item.status">
                {{ getStatusText(item.status) }}
              </text>
              <text class="post-date">{{ item.startTime }}</text>
            </view>
            <view class="post-stats">
              <text class="stat-item">👁 {{ item.views }}</text>
              <text class="stat-item">❤️ {{ item.favorites }}</text>
              <text class="stat-item">📝 {{ item.applicants }}</text>
            </view>
          </view>
          <view class="post-actions">
            <view class="action-btn" @click="editItem(item)">编辑</view>
            <view class="action-btn" @click="moreActions(item)">更多</view>
          </view>
        </view>
      </view>

      <!-- 岗位列表 -->
      <view v-else class="list-content">
        <view 
          class="post-card job-card" 
          v-for="item in list" 
          :key="item.id"
        >
          <view class="job-header">
            <text class="job-title">{{ item.title }}</text>
            <text class="job-salary">{{ item.salary }}</text>
          </view>
          <view class="job-tags">
            <text class="job-tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
          </view>
          <view class="job-meta">
            <text class="post-status" :class="item.status">
              {{ getStatusText(item.status) }}
            </text>
            <text class="post-date">{{ item.location }}</text>
          </view>
          <view class="post-stats">
            <text class="stat-item">👁 {{ item.views }}</text>
            <text class="stat-item">❤️ {{ item.favorites }}</text>
            <text class="stat-item">📝 {{ item.applicants }}</text>
          </view>
          <view class="post-actions">
            <view class="action-btn" @click="editItem(item)">编辑</view>
            <view class="action-btn" @click="moreActions(item)">更多</view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty" v-if="list.length === 0 && !loading">
        <text class="empty-icon">{{ currentTab === 'events' ? '🎪' : '💼' }}</text>
        <text class="empty-text">暂无{{ currentTab === 'events' ? '活动' : '岗位' }}</text>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="list.length > 0">
        <text v-if="loading">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
      </view>
    </scroll-view>

    <!-- 新建按钮 -->
    <view class="fab" @click="createNew">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'events',
      statusFilter: 'all',
      stats: {
        eventCount: 0,
        jobCount: 0
      },
      list: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false
    }
  },
  onLoad() {
    this.loadStats()
    this.loadList()
  },
  onPullDownRefresh() {
    this.page = 1
    this.noMore = false
    this.loadList().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    async loadStats() {
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/organizer/stats`,
          method: 'GET'
        })
        if (res.data.code === 200) {
          this.stats = res.data.data
        }
      } catch (e) {
        console.error('加载统计失败:', e)
      }
    },
    switchTab(tab) {
      this.currentTab = tab
      this.page = 1
      this.noMore = false
      this.loadList()
    },
    switchStatus(status) {
      this.statusFilter = status
      this.page = 1
      this.noMore = false
      this.loadList()
    },
    async loadList() {
      if (this.loading) return
      this.loading = true
      
      try {
        const type = this.currentTab === 'events' ? 'events' : 'jobs'
        const res = await uni.request({
          url: `${this.$apiUrl}/organizer/${type}`,
          method: 'GET',
          data: {
            status: this.statusFilter === 'all' ? undefined : this.statusFilter,
            page: this.page,
            pageSize: this.pageSize
          }
        })
        
        if (res.data.code === 200) {
          const list = res.data.data.list
          if (this.page === 1) {
            this.list = list
          } else {
            this.list = [...this.list, ...list]
          }
          this.noMore = list.length < this.pageSize
        }
      } catch (e) {
        console.error('加载列表失败:', e)
      } finally {
        this.loading = false
      }
    },
    loadMore() {
      if (!this.noMore && !this.loading) {
        this.page++
        this.loadList()
      }
    },
    getStatusText(status) {
      const map = {
        draft: '草稿',
        published: '已发布',
        ended: '已结束'
      }
      return map[status] || status
    },
    editItem(item) {
      const url = this.currentTab === 'events' 
        ? `/pages/organizer/publish-event?id=${item.id}`
        : `/pages/organizer/publish-job?id=${item.id}`
      uni.navigateTo({ url })
    },
    moreActions(item) {
      const actions = ['查看数据', '复制', '删除']
      
      uni.showActionSheet({
        itemList: actions,
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.viewStats(item)
              break
            case 1:
              this.copyItem(item)
              break
            case 2:
              this.deleteItem(item)
              break
          }
        }
      })
    },
    viewStats(item) {
      uni.navigateTo({ url: `/pages/organizer/stats?id=${item.id}` })
    },
    copyItem(item) {
      uni.showToast({ title: '复制成功' })
    },
    deleteItem(item) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个' + (this.currentTab === 'events' ? '活动' : '岗位') + '吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const type = this.currentTab === 'events' ? 'events' : 'jobs'
              const res = await uni.request({
                url: `${this.$apiUrl}/organizer/${type}/${item.id}`,
                method: 'DELETE'
              })
              if (res.data.code === 200) {
                uni.showToast({ title: '删除成功' })
                this.loadList()
              }
            } catch (e) {
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        }
      })
    },
    createNew() {
      const url = this.currentTab === 'events'
        ? '/pages/organizer/publish-event'
        : '/pages/organizer/publish-job'
      uni.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
.my-posts {
  min-height: 100vh;
  background: #f5f6fa;
}

.tabs {
  display: flex;
  background: #fff;
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

.filter-bar {
  display: flex;
  background: #fff;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.filter-item {
  padding: 20rpx;
  font-size: 26rpx;
  color: #666;
}

.filter-item.active {
  color: #667eea;
  font-weight: bold;
}

.post-list {
  height: calc(100vh - 180rpx);
  padding: 20rpx;
}

.post-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
}

.post-cover {
  width: 100%;
  height: 200rpx;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.post-info {
  width: 100%;
  margin-bottom: 16rpx;
}

.post-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.post-meta {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.post-status {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  margin-right: 12rpx;
}

.post-status.published { background: #dcfce7; color: #16a34a; }
.post-status.draft { background: #fef3c7; color: #d97706; }
.post-status.ended { background: #f3f4f6; color: #6b7280; }

.post-date {
  font-size: 24rpx;
  color: #999;
}

.post-stats {
  display: flex;
  gap: 20rpx;
  margin-bottom: 16rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #999;
}

.post-actions {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-btn {
  padding: 12rpx 32rpx;
  background: #f5f6fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

/* 岗位卡片样式 */
.job-card {
  display: block;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.job-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.job-salary {
  font-size: 30rpx;
  font-weight: bold;
  color: #f97316;
}

.job-tags {
  display: flex;
  gap: 8rpx;
  margin-bottom: 12rpx;
}

.job-tag {
  padding: 4rpx 12rpx;
  background: #f5f6fa;
  border-radius: 4rpx;
  font-size: 22rpx;
  color: #666;
}

.job-meta {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.fab {
  position: fixed;
  bottom: 60rpx;
  right: 40rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
}

.fab-icon {
  font-size: 50rpx;
  color: #fff;
  font-weight: bold;
}
</style>
