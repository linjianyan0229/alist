<template>
  <div class="layout-container">
    <!-- 头部导航栏 -->
    <header class="header">
      <div class="header-content">
        <!-- 左侧Logo区域 -->
        <div class="logo-section">
          <div class="logo" @click="handleLogoClick">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z" 
                    fill="currentColor"/>
            </svg>
            <span class="logo-text">AList</span>
          </div>
          <div class="breadcrumb">
            <span v-if="currentPath" class="breadcrumb-item">{{ currentPath }}</span>
          </div>
        </div>

        <!-- 右侧视图切换和用户区域 -->
        <div class="header-actions">
          <!-- 视图切换 -->
          <div class="view-switcher">
            <button 
              class="view-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="handleViewChange('grid')"
              title="网格视图"
            >
              <el-icon><Grid /></el-icon>
            </button>
            <button 
              class="view-btn"
              :class="{ active: viewMode === 'list' }"
              @click="handleViewChange('list')"
              title="列表视图"
            >
              <el-icon><List /></el-icon>
            </button>
            <button 
              class="view-btn"
              :class="{ active: viewMode === 'image' }"
              @click="handleViewChange('image')"
              title="图片视图"
            >
              <el-icon><Picture /></el-icon>
            </button>
          </div>

          <!-- 分隔线 -->
          <div class="divider"></div>

          <!-- 用户信息 -->
          <div class="user-section">
            <el-dropdown @command="handleCommand" trigger="click">
              <div class="user-info">
                <el-avatar :size="32" class="user-avatar">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span class="username">{{ userInfo.username }}</span>
                <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="user-dropdown">
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>
                    个人资料
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>
                    设置
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <router-view 
        :view-mode="viewMode"
        @update-path="handlePathUpdate"
      />
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">
          © 2024 AList 文件管理系统. 保留所有权利.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowDown, User, Setting, SwitchButton, House,
  Grid, List, Picture
} from '@element-plus/icons-vue'
import { authApi } from '../api/auth.js'
import { getUserInfo, clearAuthData } from '../utils/auth.js'

// 定义事件
const emit = defineEmits(['view-change', 'update-path'])

// 定义props
const props = defineProps({
  viewMode: {
    type: String,
    default: 'list'
  },
  currentPath: {
    type: String,
    default: ''
  }
})

// 内部视图模式状态
const viewMode = ref(props.viewMode)

// 处理路径更新
const handlePathUpdate = (path) => {
  emit('update-path', path)
}

// 处理视图切换
const handleViewChange = (mode) => {
  viewMode.value = mode
  emit('view-change', mode)
}

const router = useRouter()

// 用户信息
const userInfo = ref({
  username: '加载中...',
  email: '',
  role: '',
  avatar: ''
})

// 获取用户信息
const fetchUserProfile = async () => {
  try {
    const response = await authApi.getProfile()
    userInfo.value = response.user
  } catch (error) {
    console.error('获取用户信息失败:', error)
    const localUserInfo = getUserInfo()
    if (localUserInfo) {
      userInfo.value = localUserInfo
    } else {
      ElMessage.error('获取用户信息失败')
    }
  }
}

// 处理下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中...')
      break
    case 'settings':
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      await handleLogout()
      break
  }
}

// 处理登出
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '确认退出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    try {
      await authApi.logout()
    } catch (error) {
      console.warn('服务器登出失败，但会清除本地数据:', error)
    }

    clearAuthData()
    ElMessage.success('退出成功')
    await router.push('/login')
  } catch {
    // 用户取消登出
  }
}

// 组件挂载时获取用户信息
onMounted(() => {
  const localUserInfo = getUserInfo()
  if (localUserInfo) {
    userInfo.value = localUserInfo
  }
  fetchUserProfile()
})

// 处理Logo点击
const handleLogoClick = () => {
  // 实现返回首页的功能
  router.push('/')
}
</script>

<style scoped>
/* 自然柔和风格样式 */
.layout-container {
  min-height: 100vh;
  background-color: #f5f5f1; /* 淡米色背景 */
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* 头部导航栏 */
.header {
  background-color: #fffcf6; /* 奶白色背景 */
  border-bottom: 1px solid #e4ddd3; /* 淡棕色边框 */
  box-shadow: 0 2px 8px rgba(156, 148, 134, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo区域 */
.logo-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: #6e8b67; /* 中等绿色 */
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #6e8b67; /* 中等绿色标题 */
  letter-spacing: -0.5px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4a593d; /* 深绿色文字 */
  font-size: 14px;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #6e8b67;
  opacity: 0.6;
}

/* 头部操作区域 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 视图切换器 */
.view-switcher {
  display: flex;
  align-items: center;
  background-color: #f5f5f1;
  border-radius: 15px;
  padding: 4px;
  border: 1px solid #e4ddd3;
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6e8b67;
}

.view-btn:hover {
  background-color: #fffcf6;
  color: #4a593d;
}

.view-btn.active {
  background-color: #a9c3a6; /* 淡绿色按钮 */
  color: #fffcf6;
  box-shadow: 0 2px 4px rgba(169, 195, 166, 0.3);
}

/* 分隔线 */
.divider {
  width: 1px;
  height: 24px;
  background-color: #e4ddd3;
}

/* 用户区域 */
.user-section {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.user-info:hover {
  background-color: #f5f5f1;
  border-color: #e4ddd3;
}

.user-avatar {
  background-color: #a9c3a6;
  color: #fffcf6;
}

.username {
  color: #4a593d;
  font-size: 14px;
  font-weight: 500;
}

.dropdown-icon {
  color: #6e8b67;
  font-size: 14px;
  transition: transform 0.3s ease;
}

/* 用户下拉菜单样式 */
.user-dropdown {
  border: 1px solid #e4ddd3;
  border-radius: 15px;
  background-color: #fffcf6;
  box-shadow: 0 5px 15px rgba(156, 148, 134, 0.1);
  overflow: hidden;
}

.user-dropdown :deep(.el-dropdown-menu__item) {
  color: #4a593d;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.user-dropdown :deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f5f1;
  color: #6e8b67;
}

/* 主体内容 */
.main-content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 24px;
}

/* 底部 */
.footer {
  background-color: #fffcf6;
  border-top: 1px solid #e4ddd3;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  text-align: center;
}

.footer-text {
  color: #6e8b67;
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
    height: 56px;
  }
  
  .logo-section {
    gap: 16px;
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .breadcrumb {
    display: none;
  }
  
  .username {
    display: none;
  }
  
  .main-content {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .view-switcher {
    padding: 2px;
  }
  
  .view-btn {
    width: 32px;
    height: 32px;
  }
}
</style> 