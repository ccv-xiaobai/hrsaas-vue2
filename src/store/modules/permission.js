// 不是所有的路由都应该被访问
// 静态路由 是可以一直被访问的
// 动态路由 得根据当前登陆者身份进行筛选
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 定义当前用户拥有的路有权限
  routes: constantRoutes // 默认就有静动态路由权限
}
const mutations = {
  // 更新路由的数据
  setRoutes(state, newRoutes) {
    // 登录 = > 获取新扥路由 =>合并
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选路由  menus => 筛选出 可以 访问的动态路由表 进行返回 同时提交mutations
  // ["employees", "settings", "permissions", "social_securitys", "approvals", "attendances", "salarys", "departments"]
  filterRoutes({ commit }, menus) {
    // 此时 menus 要和动态路由表匹配 => 得出匹配的路由表
    // asyncRoutes => [{ name: 'approvals' }, {name: 'social_securitys'}, {}]
    // 以menus为基础
    const routes = []
    menus.forEach(key => {
      // key 就是一个标识
      routes.push(...asyncRoutes.filter(item => item.name === key))
      // 得到一个数组
    })
    // routes就是筛选之后的路由
    commit('setRoutes', routes)
    // => addRoutes => 添加到当前的路由表
    return routes
  }
}
// Vuex的子模块
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
