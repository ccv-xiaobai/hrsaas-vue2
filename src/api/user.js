import request from '@/utils/request'
// 封装一个登录请求
export function login(data) {
  return request({
    url: '/sys/login', // 疑问? 跨域的前缀(暗号) /api 有没有统一的地方写前缀？？？
    data,
    method: 'post'
  })
}

/**
 * 获取用户的基本资料
 * **/
export function getUserProfile() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/** *
 *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {

}
