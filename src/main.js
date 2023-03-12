import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import Print from 'vue-print-nb'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import * as Direcives from '@/directives'
import * as filters from '@/filters'
import Component from '@/components'
import checkPermission from '@/mixin/checkPermission'
import i18n from '@/lang'
Vue.mixin(checkPermission) // 意味着所有的组件都拥有 checkPermission的方法了
// { aa: {}, bb: {}, imagerror: {} }
Object.keys(Direcives).forEach(key => {
//  挨个的注册全局自定义指令
  Vue.directive(key, Direcives[key]) // 这里完成了全局注册指令
})
// 统一注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(Component) // 统一注册
Vue.use(Print) // 完成打印插件的注册
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value) // elementui要使用显示文本的时候 会调用 i18n函数
  // t方法 是替换的意思 => 会去语言包里 找对应的key所显示的值
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 挂载i18n
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
