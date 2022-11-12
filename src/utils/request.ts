import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { ElLoading } from 'element-plus'
import { getToken, removeToken } from '@/utils/auth'

const loadingInstance: anyObj = {
  target: null,
  options: {
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)'
  }
}

const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // 请求超时的时间限制
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 开始设置请求 发起的拦截处理
// config 代表发起请求的参数的实体
service.interceptors.request.use((config: AxiosRequestConfig) => {
    loadingInstance.target = ElLoading.service(loadingInstance.options)
    const baseUrl = import.meta.env.VITE_AXIOS_BASE_URL // url = base url + request url
    config.url = `${baseUrl}${config.url}`
    const token = getToken()
    if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      if (config.headers === undefined) config.headers = { 'X-Requested-With': 'XMLHttpRequest' }
      config.headers.Authorization = token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 请求到结果的拦截处理
service.interceptors.response.use(config => {
  loadingInstance.target.close()
  // 返回请求正确的结果
  return config
}, error => {
  loadingInstance.target.close()
  let message = ''
  // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
  if (error && error.response) {
    switch (error.response.status) {
      case 400: {
        message = '错误请求'
        if (error.response.data) {
          if (error.response.data.error === 'invalid_grant') {
            message = '登录失败'
            if (error.response.data.error_description === 'Bad credentials') {
              message = '用户名或密码错误'
            }
          } else if (error.response.data.error === 'access_denied') {
            message = '禁止登录'
            if (error.response.data.error_description === 'user role not found!') {
              message = '用户角色不存在'
            }
          }
        }
        break
      }
      case 401: {
        removeToken()
        message = '认证失败，请重新登录'
        if (error.response.data) {
          if (error.response.data.error === 'invalid_grant') {
            if (error.response.data.error_description === 'Bad credentials') {
              message = '登录参数有误'
            }
          } else if (error.response.data.error === 'unauthorized') {
            message = message + ''
          }
        }
        break
      }
      case 403:
        message = '您没有权限操作,请联系系统管理员！'
        break
      case 404:
        message = '请求错误,未找到该资源'
        break
      case 405:
        message = '请求方法未允许'
        break
      case 408:
        message = '请求超时'
        break
      case 500:
        if (error.response.data !== '') {
          message = error.response.data
        } else {
          message = '服务器端出错'
        }
        break
      case 501:
        message = '网络未实现'
        break
      case 502:
        message = '网络错误'
        break
      case 503:
        message = '服务不可用'
        break
      case 504:
        message = '网络超时'
        break
      case 505:
        message = 'http版本不支持该请求'
        break
      default:
        message = `连接错误${error.response.status}`
    }
  } else {
    message = '连接到服务器失败'
  }
  return Promise.reject(message)
})

export default service
