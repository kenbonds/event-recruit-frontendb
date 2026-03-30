// pages/organizer/publish-event.vue - 发布活动页
<template>
  <view class="publish-event">
    <view class="form-container">
      <!-- 封面图 -->
      <view class="form-item">
        <text class="form-label">活动封面</text>
        <view class="cover-uploader" @click="chooseCover">
          <image v-if="form.cover" :src="form.cover" mode="aspectFill" class="cover-preview" />
          <view v-else class="cover-placeholder">
            <text class="plus">+</text>
            <text class="tip">上传封面图</text>
          </view>
        </view>
      </view>

      <!-- 活动标题 -->
      <view class="form-item">
        <text class="form-label">活动标题 <text class="required">*</text></text>
        <input 
          class="form-input" 
          v-model="form.title" 
          placeholder="请输入活动标题" 
          maxlength="50"
        />
        <text class="form-count">{{ form.title.length }}/50</text>
      </view>

      <!-- 活动标签 -->
      <view class="form-item">
        <text class="form-label">活动标签</text>
        <view class="tag-selector">
          <view 
            class="tag-option" 
            :class="{ selected: form.tags.includes(tag) }"
            v-for="tag in tagOptions" 
            :key="tag"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </view>

      <!-- 活动时间 -->
      <view class="form-item">
        <text class="form-label">活动时间 <text class="required">*</text></text>
        <view class="time-picker-row">
          <picker mode="date" :value="form.startTime" @change="onStartTimeChange">
            <view class="time-picker">
              {{ form.startTime || '选择开始日期' }}
            </view>
          </picker>
          <text class="time-separator">至</text>
          <picker mode="date" :value="form.endTime" @change="onEndTimeChange">
            <view class="time-picker">
              {{ form.endTime || '选择结束日期' }}
            </view>
          </picker>
        </view>
      </view>

      <!-- 活动地点 -->
      <view class="form-item">
        <text class="form-label">活动地点 <text class="required">*</text></text>
        <input 
          class="form-input" 
          v-model="form.location" 
          placeholder="请输入活动地点" 
        />
      </view>

      <!-- 人数限制 -->
      <view class="form-item">
        <text class="form-label">人数限制 <text class="required">*</text></text>
        <input 
          class="form-input" 
          type="number" 
          v-model="form.maxParticipants" 
          placeholder="请输入人数上限" 
        />
      </view>

      <!-- 报名费用 -->
      <view class="form-item">
        <text class="form-label">报名费用</text>
        <view class="price-selector">
          <view 
            class="price-option" 
            :class="{ selected: form.price === 0 }"
            @click="form.price = 0"
          >
            免费
          </view>
          <view 
            class="price-option" 
            :class="{ selected: form.price > 0 }"
            @click="showPriceInput = true"
          >
            付费
          </view>
          <input 
            v-if="form.price > 0"
            class="price-input" 
            type="digit" 
            v-model="form.price" 
            placeholder="输入金额" 
          />
          <text class="price-unit" v-if="form.price > 0">元</text>
        </view>
      </view>

      <!-- 活动描述 -->
      <view class="form-item">
        <text class="form-label">活动描述 <text class="required">*</text></text>
        <textarea 
          class="form-textarea" 
          v-model="form.description" 
          placeholder="请详细描述活动内容、流程、注意事项等..." 
          maxlength="2000"
        />
        <text class="form-count">{{ form.description.length }}/2000</text>
      </view>

      <!-- 报名信息 -->
      <view class="form-item">
        <text class="form-label">报名信息</text>
        <view class="info-checkboxes">
          <checkbox-group @change="onInfoChange">
            <label class="checkbox-item">
              <checkbox value="name" :checked="form.requireFields.includes('name')" /> 姓名
            </label>
            <label class="checkbox-item">
              <checkbox value="phone" :checked="form.requireFields.includes('phone')" /> 手机号
            </label>
            <label class="checkbox-item">
              <checkbox value="email" :checked="form.requireFields.includes('email')" /> 邮箱
            </label>
            <label class="checkbox-item">
              <checkbox value="company" :checked="form.requireFields.includes('company')" /> 公司
            </label>
            <label class="checkbox-item">
              <checkbox value="position" :checked="form.requireFields.includes('position')" /> 职位
            </label>
          </checkbox-group>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="form-item">
        <text class="form-label">联系方式</text>
        <input 
          class="form-input" 
          v-model="form.contact" 
          placeholder="请输入联系人或联系方式" 
        />
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <button class="save-btn" @click="saveDraft">保存草稿</button>
      <button class="publish-btn" @click="publish">发布活动</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showPriceInput: false,
      tagOptions: ['技术', '产品', '设计', '运营', '市场', 'HR', '金融', '医疗', '教育', '其他'],
      form: {
        cover: '',
        title: '',
        tags: [],
        startTime: '',
        endTime: '',
        location: '',
        maxParticipants: 100,
        price: 0,
        description: '',
        requireFields: ['name', 'phone'],
        contact: ''
      }
    }
  },
  methods: {
    chooseCover() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.form.cover = res.tempFilePaths[0]
          // TODO: 上传到COS
        }
      })
    },
    toggleTag(tag) {
      const index = this.form.tags.indexOf(tag)
      if (index > -1) {
        this.form.tags.splice(index, 1)
      } else {
        if (this.form.tags.length >= 3) {
          uni.showToast({ title: '最多选择3个标签', icon: 'none' })
          return
        }
        this.form.tags.push(tag)
      }
    },
    onStartTimeChange(e) {
      this.form.startTime = e.detail.value
    },
    onEndTimeChange(e) {
      this.form.endTime = e.detail.value
    },
    onInfoChange(e) {
      this.form.requireFields = e.detail.value
    },
    validate() {
      if (!this.form.title) {
        uni.showToast({ title: '请输入活动标题', icon: 'none' })
        return false
      }
      if (!this.form.startTime || !this.form.endTime) {
        uni.showToast({ title: '请选择活动时间', icon: 'none' })
        return false
      }
      if (!this.form.location) {
        uni.showToast({ title: '请输入活动地点', icon: 'none' })
        return false
      }
      if (!this.form.description) {
        uni.showToast({ title: '请输入活动描述', icon: 'none' })
        return false
      }
      return true
    },
    async saveDraft() {
      uni.showLoading({ title: '保存中...' })
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/organizer/events/draft`,
          method: 'POST',
          data: this.form
        })
        if (res.data.code === 200) {
          uni.showToast({ title: '保存成功' })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      } catch (e) {
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    async publish() {
      if (!this.validate()) return
      
      uni.showModal({
        title: '确认发布',
        content: '确定要发布这个活动吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '发布中...' })
            try {
              const res = await uni.request({
                url: `${this.$apiUrl}/organizer/events`,
                method: 'POST',
                data: this.form
              })
              if (res.data.code === 200) {
                uni.showToast({ title: '发布成功' })
                setTimeout(() => {
                  uni.navigateBack()
                }, 1500)
              }
            } catch (e) {
              uni.showToast({ title: '发布失败', icon: 'none' })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.publish-event {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 140rpx;
}

.form-container {
  padding: 20rpx;
}

.form-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.form-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.required {
  color: #ff4d4f;
}

.form-input {
  width: 100%;
  height: 80rpx;
  background: #f5f6fa;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.form-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  display: block;
  margin-top: 8rpx;
}

.form-textarea {
  width: 100%;
  min-height: 240rpx;
  background: #f5f6fa;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.cover-uploader {
  width: 100%;
  height: 300rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.cover-preview {
  width: 100%;
  height: 100%;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.plus {
  font-size: 60rpx;
  color: #ccc;
}

.tip {
  font-size: 26rpx;
  color: #999;
  margin-top: 10rpx;
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag-option {
  padding: 12rpx 24rpx;
  background: #f5f6fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.tag-option.selected {
  background: #667eea;
  color: #fff;
}

.time-picker-row {
  display: flex;
  align-items: center;
}

.time-picker {
  flex: 1;
  height: 80rpx;
  background: #f5f6fa;
  border-radius: 12rpx;
  padding: 0 20rpx;
  line-height: 80rpx;
  font-size: 28rpx;
}

.time-separator {
  padding: 0 20rpx;
  color: #999;
}

.price-selector {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.price-option {
  padding: 12rpx 32rpx;
  background: #f5f6fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.price-option.selected {
  background: #667eea;
  color: #fff;
}

.price-input {
  width: 160rpx;
  height: 72rpx;
  background: #f5f6fa;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
}

.price-unit {
  font-size: 28rpx;
  color: #666;
}

.info-checkboxes {
  background: #f5f6fa;
  border-radius: 12rpx;
  padding: 20rpx;
}

.checkbox-item {
  display: inline-block;
  margin-right: 30rpx;
  margin-bottom: 10rpx;
  font-size: 26rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
}

.save-btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  background: #f5f6fa;
  color: #666;
  border-radius: 44rpx;
  font-size: 30rpx;
  border: none;
  margin-right: 20rpx;
}

.publish-btn {
  flex: 2;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: bold;
  border: none;
}
</style>
