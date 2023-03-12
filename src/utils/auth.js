import Cookies from 'js-cookie'

const TokenKey = 'ihrm-hrsaas-token'
const timeKey = 'ihrm-hrsaas-time' // 定义一个独一无二的key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey) // 从缓存中读取时间戳
}

// 设置时间戳
export function setTimeStamp() {
  // 设置时间戳 其实是设置当前时间
  Cookies.set(timeKey, Date.now())
  // 这里不写return也可以呢？
}
