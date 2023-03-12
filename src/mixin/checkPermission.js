import store from '@/store'
export default {
  // 对象结构和组件是一样的 一旦全局混入 意味着所有的组件都自动拥有 该方法
  methods: {
    // add-user
    checkPermission(key) {
      const { userInfo } = store.state.user
      //   检查 Vuex中权限点是否存在某个操作权限
      if (userInfo.roles.points && userInfo.roles.points.length) {
        // 如果有表示 此人正好能操作该权限 如果没有 表示该人不能操作该按钮
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
