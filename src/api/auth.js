import request from '../utils/axios.js'

/**
 * 用户认证相关API
 */
export const authApi = {
  /**
   * 用户登录
   * @param {Object} data - 登录数据
   * @param {string} data.username - 用户名或邮箱
   * @param {string} data.password - 密码
   * @param {boolean} [data.rememberMe] - 是否记住我
   * @returns {Promise} 登录响应
   */
  login(data) {
    return request({
      url: '/api/auth/login',
      method: 'POST',
      data: {
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe || false
      }
    })
  },

  /**
   * 用户登出
   * @returns {Promise} 登出响应
   */
  logout() {
    return request({
      url: '/api/auth/logout',
      method: 'POST'
    })
  },

  /**
   * 刷新访问令牌
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise} 令牌刷新响应
   */
  refreshToken(refreshToken) {
    return request({
      url: '/api/auth/refresh',
      method: 'POST',
      data: { refreshToken }
    })
  },

  /**
   * 获取当前用户信息
   * @returns {Promise} 用户信息响应
   */
  getProfile() {
    return request({
      url: '/api/auth/profile',
      method: 'GET'
    })
  },

  /**
   * 更新用户名
   * @param {string} username - 新用户名
   * @returns {Promise} 更新响应
   */
  updateUsername(username) {
    return request({
      url: '/api/auth/username',
      method: 'PUT',
      data: { username }
    })
  },

  /**
   * 更新密码
   * @param {Object} data - 密码更新数据
   * @param {string} data.currentPassword - 当前密码
   * @param {string} data.newPassword - 新密码
   * @returns {Promise} 更新响应
   */
  updatePassword(data) {
    return request({
      url: '/api/auth/password',
      method: 'PUT',
      data: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }
    })
  },

  /**
   * 用户注册（管理员功能）
   * @param {Object} data - 注册数据
   * @param {string} data.username - 用户名
   * @param {string} data.email - 邮箱
   * @param {string} data.password - 密码
   * @param {string} [data.role='user'] - 用户角色
   * @returns {Promise} 注册响应
   */
  register(data) {
    return request({
      url: '/api/auth/register',
      method: 'POST',
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role || 'user'
      }
    })
  }
}

export default authApi 