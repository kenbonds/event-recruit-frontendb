// pages/events/list.vue - 活动列表页
<template>
  <view class="events-page">
    <!-- 顶部搜索 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <input 
          class="input" 
          v-model="keyword" 
          placeholder="搜索活动..." 
          @confirm="search"
        />
        <text class="clear-icon" v-if="keyword" @click="clearSearch">✕</text>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-tabs">
      <view 
        class="filter-tab" 
        :class="{ active: filter === 'all' }"
        @click="switchFilter('all')"
      >
        全部
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: filter === 'upcoming' }"
        @click="switchFilter('upcoming')"
      >
        即将开始
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: filter === 'ongoing' }"
        @click="switchFilter('ongoing')"
      >
        进行中
      </view>
      <view 
        class="filter-tab" 
        :class="{ active: filter === 'free' }"
        @click="switchFilter('free')"
      >
        免费
      </view>
    </view>

    <!-- 排序 -->
    <view class="sort-bar">
      <view 
        class="sort-item" 
        :class="{ active: sortBy === 'time' }"
        @click="switchSort('time')"
      >
        时间 {{ sortBy === 'time' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
      </view>
      <view 
        class="sort-item" 
        :class="{ active: sortBy === 'popular' }"
        @click="switchSort('popular')"
      >
        热门 {{ sortBy === 'popular' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
      </view>
      <view class="view-toggle">
        <text 
          class="toggle-icon" 
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >☰</text>
        <text 
          class="toggle-icon" 
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
        >⊞</text>
      </view>
    </view>

    <!-- 活动列表 -->
    <scroll-view 
      class="events-list" 
      scroll-y 
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 列表视图 -->
      <view v-if="viewMode === 'list'" class="list-view">
        <view 
          class="event-card" 
          v-for="event in events" 
          :key="event.id"
          @click="goToDetail(event.id)"
        >
          <image 
            class="event-cover" 
            :src="event.coverImage || '/static/event-cover.png'" 
            mode="aspectFill"
          />
          <view class="event-info">
            <view class="event-header">
              <text class="event-status" :class="event.status">
                {{ getStatusText(event.status) }}
              </text>
              <text class="event-price" :class="{ free: event.price === 0 }">
                {{ event.price === 0 ? '免费' : `¥${event.price}` }}
              </text>
            </view>
            <text class="event-title">{{ event.title }}</text>
            <view class="event-meta">
              <text class="meta-item">📅 {{ event.startTime }}</text>
              <text class="meta-item">📍 {{ event.location }}</text>
            </view>
            <view class="event-footer">
              <view class="participants">
                <image 
                  class="participant-avatar" 
                  v-for="(p, i) in event.recentParticipants" 
                  :key="i"
                  :src="p.avatar"
                  :style="{ marginLeft: i > 0 ? '-20rpx' : 0 }"
                />
                <text class="participant-count" v-if="event.currentParticipants > 3">
                  +{{ event.currentParticipants - 3 }}
                </text>
              </view>
              <text class="organizer">{{ event.organizer }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 网格视图 -->
      <view v-else class="grid-view">
        <view 
          class="grid-item" 
          v-for="event in events" 
          :key="event.id"
          @click="goToDetail(event.id)"
        >
          <view class="grid-cover">
            <image :src="event.coverImage || '/static/event-cover.png'" mode="aspectFill" />
            <text class="grid-status" :class="event.status">
              {{ getStatusText(event.status) }}
            </text>
            <text class="grid-price" :class="{ free: event.price === 0 }">
              {{ event.price === 0 ? '免费' : `¥${event.price}` }}
            </text>
          </view>
          <view class="grid-content">
            <text class="grid-title">{{ event.title }}</text>
            <text class="grid-meta">📅 {{ event.startTime }}</text>
            <view class="grid-footer">
              <text class="grid-participants">{{ event.currentParticipants }}人参加</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty" v-if="events.length === 0 && !loading">
        <text class="empty-icon">🎪</text>
        <text class="empty-text">暂无活动</text>
        <button class="refresh-btn" @click="loadEvents">刷新试试</button>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="events.length > 0">
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
      keyword: '',
      filter: 'all',
      sortBy: 'time',
      sortOrder: 'desc',
      viewMode: 'list',
      events: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false,
      refreshing: false
    }
  },
  onLoad() {
    this.loadEvents()
  },
  onPullDownRefresh() {
    this.onRefresh()
  },
  methods: {
    search() {
      this.page = 1
      this.noMore = false
      this.loadEvents()
    },
    clearSearch() {
      this.keyword = ''
      this.search()
    },
    switchFilter(filter) {
      this.filter = filter
      this.page = 1
      this.noMore = false
      this.loadEvents()
    },
    switchSort(sortBy) {
      if (this.sortBy === sortBy) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = sortBy
        this.sortOrder = 'desc'
      }
      this.page = 1
      this.noMore = false
      this.loadEvents()
    },
    async loadEvents() {
      if (this.loading) return
      this.loading = true
      
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/events`,
          method: 'GET',
          data: {
            keyword: this.keyword || undefined,
            status: this.filter === 'all' ? undefined : this.filter,
            free: this.filter === 'free' ? true : undefined,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            page: this.page,
            pageSize: this.pageSize
          }
        })
        
        if (res.data.code === 200) {
          const list = res.data.data.list
          if (this.page === 1) {
            this.events = list
          } else {
            this.events = [...this.events, ...list]
          }
          this.noMore = list.length < this.pageSize
        }
      } catch (e) {
        console.error('加载活动失败:', e)
      } finally {
        this.loading = false
        this.refreshing = false
      }
    },
    onRefresh() {
      this.refreshing = true
      this.page = 1
      this.noMore = false
      this.loadEvents()
    },
    loadMore() {
      if (!this.noMore && !this.loading) {
        this.page++
        this.loadEvents()
      }
    },
    getStatusText(status) {
      const map = {
        upcoming: '即将开始',
        ongoing: '进行中',
        ended: '已结束'
      }
      return map[status] || status
    },
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/events/detail?id=${id}`
      })
    }
  }
}
</script>

<style scoped>
.events-page {
  min-height: 100vh;
  background: #f5f6fa;
}

.search-bar {
  padding: 20rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.search-input {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 40rpx;
  padding: 16rpx 24rpx;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.input {
  flex: 1;
  font-size: 28rpx;
}

.clear-icon {
  font-size: 24rpx;
  color: #999;
  padding: 8rpx;
}

.filter-tabs {
  display: flex;
  background: #fff;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.filter-tab {
  padding: 24rpx 20rpx;
  font-size: 26rpx;
  color: #666;
  position: relative;
}

.filter-tab.active {
  color: #667eea;
  font-weight: bold;
}

.filter-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30rpx;
  height: 4rpx;
  background: #667eea;
  border-radius: 2rpx;
}

.sort-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 16rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.sort-item {
  font-size: 26rpx;
  color: #666;
}

.sort-item.active {
  color: #667eea;
  font-weight: bold;
}

.view-toggle {
  display: flex;
  gap: 20rpx;
}

.toggle-icon {
  font-size: 32rpx;
  color: #ccc;
}

.toggle-icon.active {
  color: #667eea;
}

.events-list {
  height: calc(100vh - 240rpx);
  padding: 20rpx;
}

/* 列表视图 */
.event-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.event-cover {
  width: 240rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.event-info {
  flex: 1;
  padding: 16rpx;
  display: flex;
  flex-direction: column;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.event-status {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.event-status.upcoming { background: #fef3c7; color: #d97706; }
.event-status.ongoing { background: #dcfce7; color: #16a34a; }
.event-status.ended { background: #f3f4f6; color: #6b7280; }

.event-price {
  font-size: 24rpx;
  color: #f97316;
  font-weight: bold;
}

.event-price.free {
  color: #22c55e;
}

.event-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-meta {
  flex: 1;
}

.meta-item {
  font-size: 22rpx;
  color: #999;
  display: block;
  margin-bottom: 4rpx;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
}

.participants {
  display: flex;
  align-items: center;
}

.participant-avatar {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #fff;
}

.participant-count {
  font-size: 22rpx;
  color: #999;
  margin-left: 8rpx;
}

.organizer {
  font-size: 22rpx;
  color: #999;
}

/* 网格视图 */
.grid-view {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.grid-item {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.grid-cover {
  position: relative;
  height: 200rpx;
}

.grid-cover image {
  width: 100%;
  height: 100%;
}

.grid-status {
  position: absolute;
  top: 10rpx;
  left: 10rpx;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.grid-status.upcoming { background: #fef3c7; color: #d97706; }
.grid-status.ongoing { background: #dcfce7; color: #16a34a; }
.grid-status.ended { background: #f3f4f6; color: #6b7280; }

.grid-price {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  font-size: 24rpx;
  color: #fff;
  background: rgba(0,0,0,0.5);
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.grid-price.free {
  background: #22c55e;
}

.grid-content {
  padding: 16rpx;
}

.grid-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.grid-meta {
  font-size: 22rpx;
  color: #999;
  display: block;
  margin-bottom: 8rpx;
}

.grid-footer {
  display: flex;
  justify-content: space-between;
}

.grid-participants {
  font-size: 22rpx;
  color: #667eea;
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
  margin-bottom: 30rpx;
}

.refresh-btn {
  padding: 16rpx 40rpx;
  background: #667eea;
  color: #fff;
  border-radius: 30rpx;
  font-size: 26rpx;
}

.load-more {
  text-align: center;
  padding: 30rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
