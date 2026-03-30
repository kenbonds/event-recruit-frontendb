// pages/organizer/publish-job.vue - 发布岗位页
<template>
  <view class="publish-job">
    <view class="form-container">
      <!-- 职位名称 -->
      <view class="form-item">
        <text class="form-label">职位名称 <text class="required">*</text></text>
        <input 
          class="form-input" 
          v-model="form.title" 
          placeholder="请输入职位名称" 
          maxlength="30"
        />
        <text class="form-count">{{ form.title.length }}/30</text>
      </view>

      <!-- 职位标签 -->
      <view class="form-item">
        <text class="form-label">职位标签</text>
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

      <!-- 薪资范围 -->
      <view class="form-item">
        <text class="form-label">薪资范围 <text class="required">*</text></text>
        <view class="salary-inputs">
          <input 
            class="salary-input" 
            type="digit" 
            v-model="form.salaryMin" 
            placeholder="最低" 
          />
          <text class="salary-separator">K</text>
          <text class="salary-line">-</text>
          <input 
            class="salary-input" 
            type="digit" 
            v-model="form.salaryMax" 
            placeholder="最高" 
          />
          <text class="salary-separator">K</text>
          <text class="salary-tip">· 13薪</text>
        </view>
      </view>

      <!-- 工作城市 -->
      <view class="form-item">
        <text class="form-label">工作城市 <text class="required">*</text></text>
        <picker mode="region" :value="form.city" @change="onCityChange">
          <view class="picker">
            {{ form.city.join('') || '请选择城市' }}
          </view>
        </picker>
      </view>

      <!-- 详细地址 -->
      <view class="form-item">
        <text class="form-label">详细地址</text>
        <input 
          class="form-input" 
          v-model="form.address" 
          placeholder="请输入详细办公地址" 
        />
      </view>

      <!-- 学历要求 -->
      <view class="form-item">
        <text class="form-label">学历要求 <text class="required">*</text></text>
        <picker :range="educationOptions" @change="onEducationChange">
          <view class="picker">
            {{ form.education || '请选择学历要求' }}
          </view>
        </picker>
      </view>

      <!-- 经验要求 -->
      <view class="form-item">
        <text class="form-label">经验要求 <text class="required">*</text></text>
        <picker :range="experienceOptions" @change="onExperienceChange">
          <view class="picker">
            {{ form.experience || '请选择经验要求' }}
          </view>
        </picker>
      </view>

      <!-- 招聘人数 -->
      <view class="form-item">
        <text class="form-label">招聘人数 <text class="required">*</text></text>
        <input 
          class="form-input" 
          type="number" 
          v-model="form.recruitCount" 
          placeholder="请输入招聘人数" 
        />
      </view>

      <!-- 职位诱惑 -->
      <view class="form-item">
        <text class="form-label">职位诱惑</text>
        <view class="benefit-selector">
          <view 
            class="benefit-option" 
            :class="{ selected: form.benefits.includes(b) }"
            v-for="b in benefitOptions" 
            :key="b"
            @click="toggleBenefit(b)"
          >
            {{ b }}
          </view>
        </view>
      </view>

      <!-- 职位描述 -->
      <view class="form-item">
        <text class="form-label">职位描述 <text class="required">*</text></text>
        <textarea 
          class="form-textarea" 
          v-model="form.description" 
          placeholder="请详细描述岗位职责、任职要求等..." 
          maxlength="3000"
        />
        <text class="form-count">{{ form.description.length }}/3000</text>
      </view>

      <!-- 联系方式 -->
      <view class="form-item">
        <text class="form-label">联系方式 <text class="required">*</text></text>
        <input 
          class="form-input" 
          v-model="form.contact" 
          placeholder="请输入HR联系方式" 
        />
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <button class="save-btn" @click="saveDraft">保存草稿</button>
      <button class="publish-btn" @click="publish">发布岗位</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tagOptions: ['全职', '兼职', '实习', '远程', '弹性', '急招', '初创', '大厂'],
      benefitOptions: ['六险一金', '五险一金', '年终奖', '股票期权', '带薪年假', '弹性工作', '技术氛围', '团队氛围好', '零食下午茶', '健身瑜伽', '定期体检', '节日福利'],
      educationOptions: ['不限', '大专', '本科', '硕士', '博士'],
      experienceOptions: ['不限', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'],
      form: {
        title: '',
        tags: [],
        salaryMin: '',
        salaryMax: '',
        city: [],
        address: '',
        education: '',
        experience: '',
        recruitCount: 1,
        benefits: [],
        description: '',
        contact: ''
      }
    }
  },
  methods: {
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
    toggleBenefit(benefit) {
      const index = this.form.benefits.indexOf(benefit)
      if (index > -1) {
        this.form.benefits.splice(index, 1)
      } else {
        if (this.form.benefits.length >= 6) {
          uni.showToast({ title: '最多选择6个福利', icon: 'none' })
          return
        }
        this.form.benefits.push(benefit)
      }
    },
    onCityChange(e) {
      this.form.city = e.detail.value
    },
    onEducationChange(e) {
      this.form.education = this.educationOptions[e.detail.value]
    },
    onExperienceChange(e) {
      this.form.experience = this.experienceOptions[e.detail.value]
    },
    validate() {
      if (!this.form.title) {
        uni.showToast({ title: '请输入职位名称', icon: 'none' })
        return false
      }
      if (!this.form.salaryMin || !this.form.salaryMax) {
        uni.showToast({ title: '请输入薪资范围', icon: 'none' })
        return false
      }
      if (this.form.city.length === 0) {
        uni.showToast({ title: '请选择工作城市', icon: 'none' })
        return false
      }
      if (!this.form.education) {
        uni.showToast({ title: '请选择学历要求', icon: 'none' })
        return false
      }
      if (!this.form.experience) {
        uni.showToast({ title: '请选择经验要求', icon: 'none' })
        return false
      }
      if (!this.form.description) {
        uni.showToast({ title: '请输入职位描述', icon: 'none' })
        return false
      }
      if (!this.form.contact) {
        uni.showToast({ title: '请输入联系方式', icon: 'none' })
        return false
      }
      return true
    },
    async saveDraft() {
      uni.showLoading({ title: '保存中...' })
      try {
        const res = await uni.request({
          url: `${this.$apiUrl}/organizer/jobs/draft`,
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
        content: '确定要发布这个岗位吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '发布中...' })
            try {
              const res = await uni.request({
                url: `${this.$apiUrl}/organizer/jobs`,
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
.publish-job {
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
  min-height: 300rpx;
  background: #f5f6fa;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.picker {
  width: 100%;
  height: 80rpx;
  background: #f5f6fa;
  border-radius: 12rpx;
  padding: 0 20rpx;
  line-height: 80rpx;
  font-size: 28rpx;
}

.tag-selector, .benefit-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag-option, .benefit-option {
  padding: 12rpx 24rpx;
  background: #f5f6fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.tag-option.selected, .benefit-option.selected {
  background: #667eea;
  color: #fff;
}

.salary-inputs {
  display: flex;
  align-items: center;
}

.salary-input {
  width: 140rpx;
  height: 72rpx;
  background: #f5f6fa;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  text-align: center;
}

.salary-separator {
  font-size: 28rpx;
  color: #666;
  margin-left: 8rpx;
}

.salary-line {
  font-size: 32rpx;
  color: #999;
  margin: 0 16rpx;
}

.salary-tip {
  font-size: 24rpx;
  color: #999;
  margin-left: 16rpx;
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
