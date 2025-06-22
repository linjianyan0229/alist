<template>
  <div class="login-container">
    <div class="login-card-wrapper">
      <!-- 登录卡片 -->
      <div class="login-card">
        <!-- 头部信息 -->
        <div class="login-header">
          <h1 class="login-title">AList 管理系统</h1>
          <p class="login-subtitle">请登录您的账户</p>
        </div>

        <!-- 登录表单 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          label-width="0"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              size="large"
              placeholder="用户名"
              prefix-icon="User"
              clearable
              class="custom-input"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              size="large"
              placeholder="密码"
              prefix-icon="Lock"
              show-password
              clearable
              class="custom-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <div class="form-actions">
              <el-checkbox v-model="loginForm.remember" class="custom-checkbox">
                记住我
              </el-checkbox>
              <button type="button" class="forgot-password-btn">
                忘记密码？
              </button>
            </div>
          </el-form-item>

          <el-form-item>
            <button
              type="button"
              class="login-btn"
              :class="{ 'loading': loading }"
              @click="handleLogin"
              :disabled="loading"
            >
              <span v-if="loading" class="loading-text">登录中...</span>
              <span v-else>登录</span>
            </button>
          </el-form-item>
        </el-form>

        <!-- 演示账户信息 -->
        <div class="demo-info">
          <div class="demo-divider">
            <span class="demo-divider-text">演示账户</span>
          </div>
          <div class="demo-account">
            <p class="demo-text">用户名: admin</p>
            <p class="demo-text">密码: 123456</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { authApi } from '../api/auth.js'
import { setAuthData } from '../utils/auth.js'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 验证表单
    await loginFormRef.value.validate()
    
    loading.value = true

    // 调用登录API
    const response = await authApi.login({
      username: loginForm.username,
      password: loginForm.password,
      rememberMe: loginForm.remember
    })

    // 保存认证信息
    setAuthData(response)

    // 显示成功消息
    ElMessage.success(response.message || '登录成功')
    
    // 跳转到首页
    await router.push('/')
    
  } catch (error) {
    console.error('登录失败:', error)
    
    // 显示错误消息
    const errorMessage = error?.error || error?.message || '登录失败，请重试'
    ElMessage.error(errorMessage)
    
    // 根据错误类型处理
    if (error?.code === 'INVALID_CREDENTIALS') {
      ElMessage.error('用户名或密码错误')
    } else if (error?.code === 'ACCOUNT_DISABLED') {
      ElMessage.error('账户已被禁用，请联系管理员')
    } else if (error?.code === 'RATE_LIMIT_EXCEEDED') {
      ElMessage.error('登录尝试次数过多，请稍后再试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 自然柔和风格样式 */
.login-container {
  min-height: 100vh;
  background-color: #f5f5f1; /* 淡米色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.login-card-wrapper {
  max-width: 400px;
  width: 100%;
}

.login-card {
  background-color: #fffcf6; /* 奶白色卡片背景 */
  border-radius: 15px; /* 组件圆角 */
  padding: 40px 30px;
  box-shadow: 0 5px 15px rgba(156, 148, 134, 0.1); /* 柔和阴影 */
  border: 1px solid #e4ddd3; /* 淡棕色边框 */
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  color: #6e8b67; /* 中等绿色标题 */
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.login-subtitle {
  color: #4a593d; /* 深绿色文字 */
  font-size: 16px;
  font-weight: 400;
  opacity: 0.8;
}

.login-form {
  margin-bottom: 24px;
}

/* 自定义输入框样式 */
.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-input) {
  border-radius: 15px;
}

.login-form :deep(.el-input__wrapper) {
  background-color: #fffcf6;
  border: 1px solid #e4ddd3;
  border-radius: 15px;
  padding: 12px 16px;
  box-shadow: none;
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #a9c3a6;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #a9c3a6;
  box-shadow: 0 0 0 2px rgba(169, 195, 166, 0.2);
}

.login-form :deep(.el-input__inner) {
  color: #4a593d;
  font-size: 15px;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: #4a593d;
  opacity: 0.6;
}

.login-form :deep(.el-input__prefix) {
  color: #6e8b67;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
}

/* 自定义复选框样式 */
.custom-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #a9c3a6;
  border-color: #a9c3a6;
}

.custom-checkbox :deep(.el-checkbox__inner) {
  border-color: #e4ddd3;
  border-radius: 4px;
}

.custom-checkbox :deep(.el-checkbox__label) {
  color: #4a593d;
  font-size: 14px;
}

.forgot-password-btn {
  background: none;
  border: none;
  color: #6e8b67;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.forgot-password-btn:hover {
  color: #8fb58b;
}

/* 自定义登录按钮 */
.login-btn {
  width: 100%;
  background-color: #a9c3a6; /* 淡绿色按钮 */
  color: #fffcf6;
  border: none;
  border-radius: 30px; /* 按钮圆角 */
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.login-btn:hover:not(:disabled) {
  background-color: #8fb58b; /* 按钮悬停状态 */
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(169, 195, 166, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn.loading {
  opacity: 0.8;
}

.loading-text {
  display: inline-flex;
  align-items: center;
}

.loading-text::after {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 8px;
  border: 2px solid transparent;
  border-top: 2px solid #fffcf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 演示信息区域 */
.demo-info {
  margin-top: 32px;
}

.demo-divider {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
}

.demo-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e4ddd3;
}

.demo-divider-text {
  background-color: #fffcf6;
  color: #6e8b67;
  padding: 0 16px;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.demo-account {
  text-align: center;
  padding: 16px;
  background-color: #f5f5f1;
  border-radius: 15px;
  border: 1px solid #e4ddd3;
}

.demo-text {
  color: #4a593d;
  font-size: 14px;
  margin: 4px 0;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .login-subtitle {
    font-size: 14px;
  }
}
</style> 