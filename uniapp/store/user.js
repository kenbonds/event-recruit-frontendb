/**
 * 用户状态管理
 */

import { authAPI } from '@/utils/api.js'

const state = {
  userInfo: null,
  token: null,
  isLoggedIn: false,
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    uni.setStorageSync('userInfo', userInfo)
  },
  SET_TOKEN(state, token) {
    state.token = token
    state.isLoggedIn = !!token
    uni.setStorageSync('token', token)
  },
  CLEAR_USER(state) {
    state.userInfo = null
    state.token = null
    state.isLoggedIn = false
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('token')
  },
}

const actions = {
  // 登录
  async login({ commit }, { phone, code }) {
    try {
      const data = await authAPI.login(phone, code)
      commit('SET_TOKEN', data.token)
      commit('SET_USER_INFO', data.user)
      return data
    } catch (e) {
      throw e
    }
  },
  
  // 注册
  async register({ commit }, { phone, code, nickname, userType }) {
    try {
      const data = await authAPI.register(phone, code, nickname, userType)
      commit('SET_TOKEN', data.token)
      commit('SET_USER_INFO', data.user)
      return data
    } catch (e) {
      throw e
    }
  },
  
  // 微信登录
  async wxLogin({ commit }, code) {
    try {
      const data = await authAPI.wxLogin(code)
      commit('SET_TOKEN', data.token)
      commit('SET_USER_INFO', data.user)
      return data
    } catch (e) {
      throw e
    }
  },
  
  // 获取用户信息
  async fetchUserInfo({ commit, state }) {
    if (!state.token) return null
    try {
      const userInfo = await authAPI.getUserInfo()
      commit('SET_USER_INFO', userInfo)
      return userInfo
    } catch (e) {
      return null
    }
  },
  
  // 更新用户信息
  async updateUserInfo({ commit }, data) {
    try {
      const userInfo = await authAPI.updateUserInfo(data)
      commit('SET_USER_INFO', userInfo)
      return userInfo
    } catch (e) {
      throw e
    }
  },
  
  // 登出
  logout({ commit }) {
    commit('CLEAR_USER')
    uni.reLaunch({
      url: '/pages/index/index'
    })
  },
  
  // 检查登录状态
  checkLogin({ commit }) {
    const token = uni.getStorageSync('token')
    const userInfo = uni.getStorageSync('userInfo')
    if (token && userInfo) {
      commit('SET_TOKEN', token)
      commit('SET_USER_INFO', userInfo)
      return true
    }
    return false
  },
}

const getters = {
  isLoggedIn: state => state.isLoggedIn,
  userInfo: state => state.userInfo,
  userType: state => state.userInfo?.userType || 1, // 1: 响应者 2: 召集方
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
