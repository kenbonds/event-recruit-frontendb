<template>
  <view class="jobs-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="icon">🔍</text>
        <input 
          type="text" 
          v-model="keyword" 
          placeholder="搜索岗位" 
          @confirm="search"
        />
      </view>
      <view class="filter-btn" @click="showFilter = true">
        <text>筛选</text>
      </view>
    </view>

    <!-- 分类标签 -->
    <scroll-view class="tabs" scroll-x>
      <view 
        class="tab" 
        :class="{ active: type === '' }"
        @click="changeType('')"
      >
        全部
      </view>
      <view 
        class="tab" 
        :class="{ active: type === '实习' }"
        @click="changeType('实习')"
      >
        实习
      </view>
      <view 
        class="tab" 
        :class="{ active: type === '全职' }"
        @click="changeType('全职')"
      >
        全职
      </view>
      <view 
        class="tab" 
        :class="{ active: type === '兼职' }"
        @click="changeType('兼职')"
      >
        兼职
      </view>
    </scroll-view>

    <!-- 岗位列表 -->
    <scroll-view 
      class="jobs-list" 
      scroll-y 
      @scrolltolower="loadMore"
    >
      <view 
        class="job-card" 
        v-for="item in jobs" 
        :key="item._id"
        @click="goDetail(item._id)"
      >
        <view class="job-header">
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
          <text class="tag" v-if="item.experience">{{ item.experience }}</text>
        </view>
        
        <view class="job-footer">
          <text class="hr" v-if="item.hrName">{{ item.hrName }}</text>
          <text class="time">{{ formatTime(item.createTime) }}</text>
        </view>
      </view>
      
      <view class="loading" v-if="loading">
        <text>加载中...</text>
      </view>
      
      <view class="no-more" v-if="!hasMore && jobs.length > 0">
        <text>- 没有更多了 -</text>
      </view>
      
      <view class="empty" v-if="jobs.length === 0 && !loading">
        <text class="icon">💼</text>
        <text>暂无岗位信息</text>
      </view>
    </scroll-view>

    <!-- 筛选弹窗 -->
    <view class="filter-popup" v-if="showFilter">
      <view class="filter-mask" @click="showFilter = false"></view>
      <view class="filter-content">
        <view class="filter-header">
          <text class="title">筛选条件</text>
          <text class="close" @click="showFilter = false">✕</text>
        </view>
        
        <view class="filter-body">
          <view class="filter-item">
            <text class="label">城市</text>
            <view class="options">
              <view 
                class="option" 
                :class="{ active: filter.city === '' }"
                @click="filter.city = ''"
              >
                不限
              </view>
              <view 
                class="option" 
                :class="{ active: filter.city === '北京' }"
                @click="filter.city = '北京'"
              >
                北京
              </view>
              <view 
                class="option" 
                :class="{ active: filter.city === '上海' }"
                @click="filter.city = '上海'"
              >
                上海
              </view>
              <view 
                class="option" 
                :class="{ active: filter.city === '深圳' }"
                @click="filter.city = '深圳'"
              >
                深圳
              </view>
              <view 
                class="option" 
                :class="{ active: filter.city === '杭州' }"
                @click="filter.city = '杭州'"
              >
                杭州
              </view>
            </view>
          </view>
          
          <view class="filter-item">
            <text class="label">薪资范围</text>
            <view class="options">
              <view 
                class="option" 
                :class="{ active: filter.salary === '' }"
                @click="filter.salary = ''"
              >
                不限
              </view>
              <view 
                class="option" 
                :class="{ active: filter.salary === '0-5k' }"
                @click="filter.salary = '0-5k'"
              >
                5K以下
              </view>
              <view 
                class="option" 
                :class="{ active: filter.salary === '5k-10k' }"
                @click="filter.salary = '5k-10k'"
              >
                5K-10K
              </view>
              <view 
                class="option" 
                :class="{ active: filter.salary === '10k-20k' }"
                @click="filter.salary = '10k-20k'"
              >
                10K-20K
              </view>
              <view 
                class="option" 
                :class="{ active: filter.salary === '20k+' }"
                @click="filter.salary = '20k+'"
              >
                20K以上
              </view>
            </view>
          </view>
        </view>
        
        <view class="filter-footer">
          <button class="reset" @click="resetFilter">重置</button>
          <button class="confirm" @click="confirmFilter">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { jobsAPI } from '@/utils/api.js'

export default {
  data() {
    return {
      jobs: [],
      keyword: '',
      type: '',
      page: 1,
      limit: 20,
      loading: false,
      hasMore: true,
      showFilter: false,
      filter: {
        city: '',
        salary: ''
      }
    }
  },
  onLoad() {
    this.loadJobs()
  },
  onPullDownRefresh() {
    this.page = 1
    this.jobs = []
    this.loadJobs().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    async loadJobs() {
      if (this.loading) return
      
      this.loading = true
      
      try {
        const params = {
          page: this.page,
          limit: this.limit,
          type: this.type,
          keyword: this.keyword,
          ...this.filter
        }
        
        const res = await jobsAPI.getList(params)
        const newJobs = res.list || res || []
        
        if (this.page === 1) {
          this.jobs = newJobs
        } else {
          this.jobs = [...this.jobs, ...newJobs]
        }
        
        this.hasMore = newJobs.length >= this.limit
      } catch (e) {
        console.error('加载岗位失败:', e)
        // 使用模拟数据
        if (this.page === 1) {
          this.jobs = [
            { _id: '1', title: '前端开发工程师', salary: '15K-25K', company: '字节跳动', city: '北京', type: '全职', verified: true, hrName: '张HR', createTime: new Date().toISOString() },
            { _id: '2', title: '产品经理实习', salary: '200-300/天', company: '腾讯', city: '深圳', type: '实习', verified: true, hrName: '李HR', createTime: new Date().toISOString() },
            { _id: '3', title: 'Java开发工程师', salary: '20K-35K', company: '阿里巴巴', city: '杭州', type: '全职', verified: true, hrName: '王HR', createTime: new Date().toISOString() },
            { _id: '4', title: '算法工程师', salary: '25K-45K', company: '百度', city: '北京', type: '全职', verified: true, createTime: new Date().toISOString() },
            { _id: '5', title: 'UI设计师', salary: '10K-20K', company: '快手', city: '北京', type: '全职', verified: true, createTime: new Date().toISOString() }
          ]
        }
      } finally {
        this.loading = false
      }
    },
    
    search() {
      this.page = 1
      this.jobs = []
      this.loadJobs()
    },
    
    changeType(type) {
      this.type = type
      this.search()
    },
    
    loadMore() {
      if (!this.hasMore || this.loading) return
      this.page++
      this.loadJobs()
    },
    
    resetFilter() {
      this.filter = { city: '', salary: '' }
    },
    
    confirmFilter() {
      this.showFilter = false
      this.search()
    },
    
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/job-detail/job-detail?id=${id}`
      })
    },
    
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      const now = new Date()
      const diff = now - date
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return '今天'
      if (days === 1) return '昨天'
      if (days < 7) return `${days}天前`
      return time.slice(0, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.jobs-page {
  min-height: 100vh;
  background: #f5f6fa;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20rpx 30rpx;
  gap: 20rpx;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f6fa;
  border-radius: 40rpx;
  padding: 16rpx 30rpx;
}

.search-input .icon {
  margin-right: 16rpx;
}

.search-input input {
  flex: 1;
  font-size: 28rpx;
}

.filter-btn {
  font-size: 28rpx;
  color: #667eea;
}

.tabs {
  display: flex;
  background: #fff;
  padding: 0 30rpx;
  white-space: nowrap;
}

.tab {
  display: inline-block;
  padding: 24rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab.active {
  color: #667eea;
  font-weight: 600;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background: #667eea;
  border-radius: 3rpx;
}

.jobs-list {
  padding: 20rpx;
  height: calc(100vh - 200rpx);
}

.job-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.job-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.job-salary {
  font-size: 30rpx;
  font-weight: 600;
  color: #f97316;
}

.job-company {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 16rpx;
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
  margin-bottom: 16rpx;
}

.tag {
  font-size: 22rpx;
  color: #666;
  background: #f5f6fa;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #999;
}

.loading, .no-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx;
  color: #999;
}

.empty .icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

/* 筛选弹窗 */
.filter-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}

.filter-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.filter-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  max-height: 70vh;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.filter-header .title {
  font-size: 32rpx;
  font-weight: 600;
}

.filter-header .close {
  font-size: 36rpx;
  color: #999;
}

.filter-body {
  padding: 30rpx;
}

.filter-item {
  margin-bottom: 40rpx;
}

.filter-item .label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.filter-item .options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.filter-item .option {
  padding: 14rpx 28rpx;
  background: #f5f6fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.filter-item .option.active {
  background: #ede9ff;
  color: #667eea;
}

.filter-footer {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;
}

.filter-footer button {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
}

.filter-footer .reset {
  background: #f5f6fa;
  color: #666;
}

.filter-footer .confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}
</style>
