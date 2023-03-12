import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserProfile, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  // 共享token状态
  token: getToken(), // 初始化的时候 缓存没有就是没有 缓存中有呢 有！
  // 共享用户的基本资料
  userInfo: {} // 这个地方为什么不做持久化呢 为什么不给一个null呢
}
const mutations = {
  // 更新token
  setToken(state, payload) {
    state.token = payload // 更新token数据
    // 同步更新到本地缓存
    setToken(payload)
  },
  // 退出登录的时候 应该清除vuex中的token 同步清除本地缓存的token
  removeToken(state) {
    state.token = null
    removeToken() // 删除本地缓存token
  },
  // 设置用户资料
  setUserInfo(state, userInfo) {
    // 如果响应式的更新一个对象
    state.userInfo = userInfo // 更新state
    // state.userInfo['name'] = value // 不是响应式
    // state.userInfo = { ...state.userInfo, ...userInfo }
  },
  // 删除用户基本资料
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 封装一个登录action
  async login(context, data) {
    const result = await login(data)
    // 如果为true表示登录成功 取返回的token
    context.commit('setToken', result)
    // promise的then catch
    // async await
    // 认为登录成功 设置登录的时间戳
    setTimeStamp()
  },
  // 获取用户信息
  async getUserInfo({ commit }) {
    const result = await getUserProfile() // 这个result就是返回的数据 data
    const detailResult = await getUserDetailById(result.userId) // 获取用户信息中的头像
    commit('setUserInfo', { ...result, ...detailResult }) // 提交mutations
    return result // 这里写return 是为了八天之后的一次相遇  一次伏笔 一次萍水相逢
  },
  // 登出action  删除token 删除用户资料
  logout({ commit }) {
    commit('removeToken')
    commit('removeUserInfo')
    // 重置路由
    resetRouter() // 重置路由
    // 重置Vuex的路由数据
    // vuex加了命令空间的子模块 怎么调用另外一个子模块
    commit('permission/setRoutes', [], { root: true })
    // 表示root:true commit实际是用顶级调用方式
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
