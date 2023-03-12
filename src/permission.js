// 进行导航守卫  守卫路由跳转
import router from '@/router'
import store from '@/store'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

// nProgress.start() 开启进度条
const whiteList = ['/login', '/404', '/reset'] // 定义白名单
// 前守卫
router.beforeEach(async(to, from, next) => {
  nProgress.start() // 开启进度条
  // to到哪里去  from从哪里来 next必须执行的回调函数 如果执行 死这儿。。。
  // 判断有没有token
  if (store.getters.token) {
    // 有token
    // 判断要跳转的页面是否是登录页
    // 假如你已经登录过 你再次去登录页的话 还有没有意义呢？
    if (to.path === '/login') {
      // 判断是否去的是登录页 如果是登录  => 跳转到主页
      // router.push('/') 这样不对 大错特错
      next('/') // 调到主页
      nProgress.done()
    } else {
      // 判断是否获取过资料 如果有userId 表示 已经获取过了 没有id表示没有获取过
      if (!store.getters.userId) {
        // 没有id的情况下要做什么 获取id
        // 调用action
        const { roles } = await store.dispatch('user/getUserInfo') // 调用获取用户资料的action
        // console.log(roles.menus)
        // 筛选路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes就是我们要添加的动态路由
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }
        ]) // 添加动态路由
        // addRoutes之后 需要多加一次跳转 才可以生效 不能直接next
        next(to.path)
        // 这里有一个特别注意的地方 promise就是异步操作
        // 应该强制等待promise进行resolve
      } else {
      // 如果不是登录页呢
        next()
      }
    }
  } else {
    // 没有token 情况下 如果一棒子打死 太粗暴了
    if (whiteList.indexOf(to.path) > -1) {
      // 在白名单里面
      next()
    } else {
      // 不在白名单里
      next('/login')
      // 必须得手动关闭
      nProgress.done()
    }
  }
})

// 后守卫 路由跳转完毕执行
router.afterEach(() => nProgress.done())
