<template>
  <view class="login-page">
    <view class="logo">
      <text class="title">召集吧</text>
      <text class="subtitle">活动招聘双向导流平台</text>
    </view>
    
    <view class="login-box">
      <!-- 手机号登录 -->
      <view class="form-item">
        <text class="label">手机号</text>
        <input 
          type="number" 
          v-model="phone" 
          placeholder="请输入手机号" 
          maxlength="11"
        />
      </view>
      
      <view class="form-item">
        <text class="label">验证码</text>
        <view class="code-input">
          <input 
            type="number" 
            v-model="code" 
            placeholder="请输入验证码" 
            maxlength="6"
          />
          <button 
            class="send-btn" 
            :disabled="countdown > 0"
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </view>
      </view>
      
      <button class="login-btn" @click="handleLogin" :loading="loading">
        登录
      </button>
      
      <view class="tips">
        <text>未注册的手机号将自动创建账号</text>
      </view>
      
      <!-- 微信登录 -->
      <view class="divider">
        <text>其他登录方式</text>
      </view>
      
      <button class="wx-btn" @click="wxLogin">
        <text class="icon">💬</text>
        <text>微信一键登录</text>
      </button>
    </view>
    
    <view class="agreement">
      <text>登录即表示同意</text>
      <text class="link">《用户协议》</text>
      <text>和</text>
      <text class="link">《隐私政策》</text>
    </view>
  </view>
</template>

<script>
import { authAPI } from '@/utils/api.js'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      phone: '',
      code: '',
      countdown: 0,
      loading: false
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    
    async sendCode() {
      if (!this.phone || this.phone.length !== 11) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      
      try {
        await authAPI.sendCode(this.phone)
        uni.showToast({
          title: '验证码已发送',
          icon: 'success'
        })
        
        // 开始倒计时
        this.countdown = 60
        const timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) {
            clearInterval(timer)
          }
        }, 1000)
      } catch (e) {
        console.error('发送验证码失败:', e)
      }
    },
    
    async handleLogin() {
      if (!this.phone || this.phone.length !== 11) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return
      }
      
      if (!this.code || this.code.length < 4) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return
      }
      
      this.loading = true
      
      try {
        await this.login({ phone: this.phone, code: this.code })
        
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      } catch (e) {
        console.error('登录失败:', e)
      } finally {
        this.loading = false
      }
    },
    
    wxLogin() {
      // #ifdef MP-WEIXIN
      uni.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          console.log('微信用户信息:', res)
          // TODO: 调用微信登录
          uni.showToast({
            title: '微信登录开发中',
            icon: 'none'
          })
        },
        fail: (err) => {
          console.log('微信登录取消:', err)
        }
      })
      // #endif
      
      // #ifndef MP-WEIXIN
      uni.showToast({
        title: '请在微信小程序中使用',
        icon: 'none'
      })
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120rpx 60rpx 60rpx;
}

.logo {
  text-align: center;
  margin-bottom: 80rpx;
}

.logo .title {
  display: block;
  font-size: 56rpx;
  font-weight: bold;
  color: #fff;
}

.logo .subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.login-box {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
}

.form-item {
  margin-bottom: 40rpx;
}

.form-item .label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.form-item input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.code-input {
  display: flex;
  gap: 20rpx;
}

.code-input input {
  flex: 1;
}

.send-btn {
  width: 200rpx;
  height: 88rpx;
  background: #667eea;
  color: #fff;
  border-radius: 12rpx;
  font-size: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.send-btn[disabled] {
  background: #ccc;
}

.login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  margin-top: 20rpx;
}

.tips {
  text-align: center;
  margin-top: 30rpx;
  font-size: 24rpx;
  color: #999;
}

.divider {
  display: flex;
  align-items: center;
  margin: 50rpx 0;
  color: #ccc;
  font-size: 24rpx;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1rpx;
  background: #e0e0e0;
}

.divider text {
  padding: 0 30rpx;
}

.wx-btn {
  width: 100%;
  height: 96rpx;
  background: #07c160;
  color: #fff;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.wx-btn .icon {
  font-size: 36rpx;
}

.agreement {
  text-align: center;
  margin-top: 40rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.agreement .link {
  color: #fff;
  text-decoration: underline;
}
</style>
