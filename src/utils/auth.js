/**
 * 用户认证状态管理工具
 */

// Token键名
const TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'userInfo'

/**
 * 获取访问令牌
 * @returns {string|null} 访问令牌
 */
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 设置访问令牌
 * @param {string} token - 访问令牌
 */
export function setAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 获取刷新令牌
 * @returns {string|null} 刷新令牌
 */
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * 设置刷新令牌
 * @param {string} token - 刷新令牌
 */
export function setRefreshToken(token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象
 */
export function getUserInfo() {
  const userInfo = localStorage.getItem(USER_KEY)
  try {
    return userInfo ? JSON.parse(userInfo) : null
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return null
  }
}

/**
 * 设置用户信息
 * @param {Object} userInfo - 用户信息对象
 */
export function setUserInfo(userInfo) {
  localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
}

/**
 * 设置完整的认证信息
 * @param {Object} authData - 认证数据
 * @param {Object} authData.user - 用户信息
 * @param {Object} authData.tokens - 令牌信息
 * @param {string} authData.tokens.accessToken - 访问令牌
 * @param {string} authData.tokens.refreshToken - 刷新令牌
 */
export function setAuthData(authData) {
  const { user, tokens } = authData
  
  if (user) {
    setUserInfo(user)
  }
  
  if (tokens) {
    if (tokens.accessToken) {
      setAccessToken(tokens.accessToken)
    }
    if (tokens.refreshToken) {
      setRefreshToken(tokens.refreshToken)
    }
  }
}

/**
 * 清除所有认证信息
 */
export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
export function isAuthenticated() {
  return !!getAccessToken()
}

/**
 * 检查是否有有效的刷新令牌
 * @returns {boolean} 是否有刷新令牌
 */
export function hasRefreshToken() {
  return !!getRefreshToken()
} 