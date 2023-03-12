import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 5400 // 定义一个超时的时间差 3600秒等于1个小时
// 创建一个axios实例
const services = axios.create({
//   axios的参数配置
  baseURL: process.env.VUE_APP_BASE_API, // 取node的环境变量
  timeout: 10000 // 当吵过多少毫秒时 认定超时
})
// axios的请求拦截器
services.interceptors.request.use(config => {
  // 同学最容易犯的错误 是经常忘记 return config
  // 注入token
  if (store.getters.token) {
    // 检查时间戳是否过期 认为登录时 存入时间戳
    if (CheckTimeOut()) {
      //  如果为true 表示超时
      // 登出操作
      store.dispatch('user/logout') // 登出 跳转
      // 跳转到登录页
      router.push('/login') // 调到登录页
      // 如果不想让请求继续发出 终止当前的promise执行
      return Promise.reject(new Error('您的token已经超时'))
    }
    // 判断有无token 有token的情况注入token
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config // 必须return
}, error => {
  // 说明请求之前错了
  return Promise.reject(error)
})
// axios的响应拦截器
services.interceptors.response.use(response => {
  // 执行成功时
  // axios是默认加了一层data
  const { success, data, message } = response.data
  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, error => {
  // 执行失败
  //  判断独一无二的状态码
  // error对象里面 有 response参数
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 认为后端接口通过检查告诉我们 token超时了
    // 登出操作
    store.dispatch('user/logout') // 登出 跳转
    router.push('/login') // 调到登录页
  }
  // 在Vue项目中但凡用this的 都是在Vue组件中的
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回一个reject 参数为一个错误对象
})
// 检查时间过期
function CheckTimeOut() {
  // 从缓存中读取时间戳 和当前的时间节点进行比较 如果相差 大于 我们设定的期限的 认定超时
  var currentTime = Date.now() // 当前时间
  var timeStamp = getTimeStamp() // 缓存中的时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
// 导出
export default services
