import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getAccessToken, getRefreshToken, setAuthData, clearAuthData } from './auth.js'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
})

// 刷新token的Promise，防止多个请求同时刷新
let refreshTokenPromise = null

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加认证token
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 开发环境打印请求信息
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log('🚀 发送请求:', config)
    }
    
    return config
  },
  error => {
    console.error('❌ 请求错误:', error)
    return Promise.reject(error)
  }
)

// 刷新访问令牌
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('没有刷新令牌')
  }

  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
    { refreshToken }
  )
  
  return response.data
}

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 开发环境打印响应信息
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log('✅ 响应成功:', response)
    }
    
    // 返回响应数据
    return response.data
  },
  async error => {
    console.error('❌ 响应错误:', error)
    
    const { response, config } = error
    
    if (response) {
      const { status, data } = response
      
      switch (status) {
        case 401:
          // token过期或无效，尝试刷新token
          if (getRefreshToken() && !config._retry) {
            config._retry = true // 标记已重试，防止无限循环
            
            try {
              // 如果已经有刷新请求在进行，等待它完成
              if (!refreshTokenPromise) {
                refreshTokenPromise = refreshAccessToken()
              }
              
              const tokenData = await refreshTokenPromise
              refreshTokenPromise = null // 重置Promise
              
              // 保存新的token
              setAuthData(tokenData)
              
              // 更新请求头
              config.headers.Authorization = `Bearer ${tokenData.tokens.accessToken}`
              
              // 重新发送原请求
              return request(config)
              
            } catch (refreshError) {
              console.error('刷新token失败:', refreshError)
              refreshTokenPromise = null // 重置Promise
              
              // 刷新失败，清除token并跳转登录
              clearAuthData()
              window.location.href = '/login'
              ElMessage.error('登录已过期，请重新登录')
              return Promise.reject(refreshError)
            }
          } else {
            // 没有refreshToken或重试失败，直接跳转登录
            clearAuthData()
            window.location.href = '/login'
            ElMessage.error('请先登录')
          }
          break
        case 403:
          ElMessage.error('权限不足')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data?.error || '请求失败')
      }
      
      return Promise.reject(data || error)
    } else {
      // 网络错误
      ElMessage.error('网络连接失败，请检查网络设置')
      return Promise.reject(error)
    }
  }
)

export default request