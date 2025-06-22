/**
 * API统一导出入口
 */

// 认证相关API
export { authApi } from './auth.js'

// 可以在这里添加其他模块的API
// export { userApi } from './user.js'
// export { fileApi } from './file.js'

// 默认导出所有API
export default {
  auth: authApi
} 