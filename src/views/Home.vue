<template>
  <div class="file-manager">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="action-btn primary" @click="uploadFile">
          <el-icon><upload-filled /></el-icon>
          <span>上传文件</span>
        </button>
        <button class="action-btn" @click="createFolder">
          <el-icon><folder-add /></el-icon>
          <span>新建文件夹</span>
        </button>
      </div>
      <div class="toolbar-right">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索文件或文件夹..."
            prefix-icon="Search"
            clearable
            class="search-input"
          />
        </div>
      </div>
    </div>

    <!-- 文件列表区域 -->
    <div class="file-content">
      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="grid-view">
        <div
          v-for="item in filteredFiles"
          :key="item.id"
          class="file-card"
          @click="handleItemClick(item)"
          @dblclick="handleItemDoubleClick(item)"
        >
          <div class="file-icon">
            <el-icon v-if="item.type === 'folder'" class="folder-icon">
              <folder />
            </el-icon>
            <el-icon v-else-if="isImageFile(item)" class="image-icon">
              <picture />
            </el-icon>
            <el-icon v-else-if="isVideoFile(item)" class="video-icon">
              <video-play />
            </el-icon>
            <el-icon v-else class="file-icon-default">
              <document />
            </el-icon>
          </div>
          <div class="file-info">
            <div class="file-name" :title="item.name">{{ item.name }}</div>
            <div class="file-meta">
              <span class="file-size">{{ formatFileSize(item.size) }}</span>
              <span class="file-date">{{ formatDate(item.modifiedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else-if="viewMode === 'list'" class="list-view">
        <div class="list-header">
          <div class="list-col name">名称</div>
          <div class="list-col size">大小</div>
          <div class="list-col date">修改时间</div>
          <div class="list-col actions">操作</div>
        </div>
        <div
          v-for="item in filteredFiles"
          :key="item.id"
          class="list-item"
          @click="handleItemClick(item)"
          @dblclick="handleItemDoubleClick(item)"
        >
          <div class="list-col name">
            <div class="item-name">
              <el-icon v-if="item.type === 'folder'" class="item-icon folder">
                <folder />
              </el-icon>
              <el-icon v-else-if="isImageFile(item)" class="item-icon image">
                <picture />
              </el-icon>
              <el-icon v-else-if="isVideoFile(item)" class="item-icon video">
                <video-play />
              </el-icon>
              <el-icon v-else class="item-icon file">
                <document />
              </el-icon>
              <span class="name-text" :title="item.name">{{ item.name }}</span>
            </div>
          </div>
          <div class="list-col size">{{ formatFileSize(item.size) }}</div>
          <div class="list-col date">{{ formatDate(item.modifiedAt) }}</div>
          <div class="list-col actions">
            <el-dropdown @command="(cmd) => handleAction(cmd, item)" trigger="click">
              <button class="action-menu-btn">
                <el-icon><more-filled /></el-icon>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="download">下载</el-dropdown-item>
                  <el-dropdown-item command="rename">重命名</el-dropdown-item>
                  <el-dropdown-item command="delete" class="danger">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- 图片视图 -->
      <div v-else-if="viewMode === 'image'" class="image-view">
        <div
          v-for="item in filteredImages"
          :key="item.id"
          class="image-card"
          @click="handleItemClick(item)"
        >
          <div class="image-thumbnail">
            <img :src="item.thumbnail" :alt="item.name" class="thumbnail-img" />
          </div>
          <div class="image-name" :title="item.name">{{ item.name }}</div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredFiles.length === 0" class="empty-state">
        <el-icon class="empty-icon"><folder-opened /></el-icon>
        <p class="empty-text">此文件夹为空</p>
        <p class="empty-subtitle">拖拽文件到此处上传，或点击上传按钮</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  UploadFilled, FolderAdd, Search, Folder, Picture, VideoPlay,
  Document, MoreFilled, FolderOpened
} from '@element-plus/icons-vue'

// 接收props
const props = defineProps({
  viewMode: {
    type: String,
    default: 'grid'
  }
})

// 传递给Layout组件
const emit = defineEmits(['update-path'])

// 视图模式
const viewMode = ref(props.viewMode)

// 搜索查询
const searchQuery = ref('')

// 当前路径
const currentPath = ref('')

// 模拟文件数据
const files = ref([
  {
    id: 1,
    name: '图片资源',
    type: 'folder',
    size: 0,
    modifiedAt: '2025-06-12 22:36:36',
    thumbnail: null
  },
  {
    id: 2,
    name: '学校资源',
    type: 'folder',
    size: 0,
    modifiedAt: '2025-06-18 14:28:54',
    thumbnail: null
  },
  {
    id: 3,
    name: '视频资源',
    type: 'folder',
    size: 0,
    modifiedAt: '2025-06-09 01:22:33',
    thumbnail: null
  },
  {
    id: 4,
    name: '软件资源',
    type: 'folder',
    size: 0,
    modifiedAt: '2025-06-18 14:11:22',
    thumbnail: null
  },
  {
    id: 5,
    name: 'example.jpg',
    type: 'file',
    extension: 'jpg',
    size: 2048576,
    modifiedAt: '2025-06-15 10:30:00',
    thumbnail: 'https://via.placeholder.com/150'
  },
  {
    id: 6,
    name: 'document.pdf',
    type: 'file',
    extension: 'pdf',
    size: 1024000,
    modifiedAt: '2025-06-14 16:45:00',
    thumbnail: null
  }
])

// 过滤后的文件列表
const filteredFiles = computed(() => {
  if (!searchQuery.value) return files.value
  
  return files.value.filter(file =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 过滤图片文件
const filteredImages = computed(() => {
  return filteredFiles.value.filter(file => 
    file.type === 'file' && isImageFile(file)
  )
})

// 判断是否为图片文件
const isImageFile = (file) => {
  if (file.type !== 'file') return false
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
  return imageExts.includes(file.extension?.toLowerCase())
}

// 判断是否为视频文件
const isVideoFile = (file) => {
  if (file.type !== 'file') return false
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm']
  return videoExts.includes(file.extension?.toLowerCase())
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '-'
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return '今天 ' + date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else if (days === 1) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// 处理文件/文件夹点击
const handleItemClick = (item) => {
  console.log('点击项目:', item)
}

// 处理文件/文件夹双击
const handleItemDoubleClick = (item) => {
  if (item.type === 'folder') {
    // 进入文件夹
    currentPath.value = item.name
    emit('update-path', item.name)
    ElMessage.success(`进入文件夹：${item.name}`)
  } else {
    // 打开文件
    ElMessage.info(`打开文件：${item.name}`)
  }
}

// 处理操作菜单
const handleAction = (action, item) => {
  switch (action) {
    case 'download':
      ElMessage.success(`下载：${item.name}`)
      break
    case 'rename':
      ElMessage.info('重命名功能开发中...')
      break
    case 'delete':
      ElMessage.warning(`删除：${item.name}`)
      break
  }
}

// 上传文件
const uploadFile = () => {
  ElMessage.info('上传文件功能开发中...')
}

// 创建文件夹
const createFolder = () => {
  ElMessage.info('新建文件夹功能开发中...')
}

// 监听Layout组件的视图切换事件
const handleViewChange = (mode) => {
  viewMode.value = mode
}

// 组件挂载
onMounted(() => {
  // 注册全局事件监听
  window.addEventListener('view-change', (event) => {
    handleViewChange(event.detail)
  })
})

// 监听props变化
watch(() => props.viewMode, (newMode) => {
  viewMode.value = newMode
})

// 暴露方法给Layout组件
defineExpose({
  handleViewChange
})
</script>

<style scoped>
/* 自然柔和风格样式 */
.file-manager {
  background-color: #f5f5f1;
  min-height: calc(100vh - 140px);
  border-radius: 15px;
  overflow: hidden;
}

/* 工具栏 */
.toolbar {
  background-color: #fffcf6;
  border: 1px solid #e4ddd3;
  border-radius: 15px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(156, 148, 134, 0.06);
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid #e4ddd3;
  background-color: #fffcf6;
  color: #4a593d;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.action-btn:hover {
  background-color: #f5f5f1;
  border-color: #a9c3a6;
  color: #6e8b67;
}

.action-btn.primary {
  background-color: #a9c3a6;
  color: #fffcf6;
  border-color: #a9c3a6;
}

.action-btn.primary:hover {
  background-color: #8fb58b;
  border-color: #8fb58b;
}

.search-box {
  width: 300px;
}

.search-input :deep(.el-input__wrapper) {
  background-color: #fffcf6;
  border: 1px solid #e4ddd3;
  border-radius: 15px;
  box-shadow: none;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #a9c3a6;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #a9c3a6;
  box-shadow: 0 0 0 2px rgba(169, 195, 166, 0.2);
}

/* 文件内容区域 */
.file-content {
  background-color: #fffcf6;
  border: 1px solid #e4ddd3;
  border-radius: 15px;
  padding: 20px;
  min-height: 400px;
  box-shadow: 0 3px 12px rgba(156, 148, 134, 0.08);
}

/* 网格视图 */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.file-card {
  background-color: #fffcf6;
  border: 1px solid #e4ddd3;
  border-radius: 15px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  user-select: none;
}

.file-card:hover {
  border-color: #a9c3a6;
  background-color: #f5f5f1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(169, 195, 166, 0.15);
}

.file-icon {
  margin-bottom: 12px;
}

.folder-icon {
  font-size: 32px;
  color: #a9c3a6;
}

.image-icon {
  font-size: 32px;
  color: #6e8b67;
}

.video-icon {
  font-size: 32px;
  color: #8fb58b;
}

.file-icon-default {
  font-size: 32px;
  color: #4a593d;
}

.file-name {
  color: #4a593d;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-size,
.file-date {
  color: #6e8b67;
  font-size: 12px;
  opacity: 0.8;
}

/* 列表视图 */
.list-view {
  display: flex;
  flex-direction: column;
}

.list-header {
  display: grid;
  grid-template-columns: 1fr 100px 180px 60px;
  gap: 16px;
  padding: 12px 16px;
  background-color: #f5f5f1;
  border-radius: 15px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #4a593d;
  font-size: 14px;
}

.list-item {
  display: grid;
  grid-template-columns: 1fr 100px 180px 60px;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.list-item:hover {
  background-color: #f5f5f1;
}

.list-col {
  display: flex;
  align-items: center;
  color: #4a593d;
  font-size: 14px;
}

.item-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-icon {
  font-size: 18px;
}

.item-icon.folder {
  color: #a9c3a6;
}

.item-icon.image {
  color: #6e8b67;
}

.item-icon.video {
  color: #8fb58b;
}

.item-icon.file {
  color: #4a593d;
}

.name-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #6e8b67;
  transition: all 0.3s ease;
}

.action-menu-btn:hover {
  background-color: #a9c3a6;
  color: #fffcf6;
}

/* 图片视图 */
.image-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.image-card {
  background-color: #fffcf6;
  border: 1px solid #e4ddd3;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-card:hover {
  border-color: #a9c3a6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(169, 195, 166, 0.15);
}

.image-thumbnail {
  aspect-ratio: 1;
  overflow: hidden;
  background-color: #f5f5f1;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-name {
  padding: 12px;
  color: #4a593d;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6e8b67;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #4a593d;
}

.empty-subtitle {
  font-size: 14px;
  opacity: 0.8;
  color: #6e8b67;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .toolbar-left {
    justify-content: center;
  }
  
  .search-box {
    width: 100%;
  }
  
  .grid-view {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
  
  .list-header,
  .list-item {
    grid-template-columns: 1fr 80px 120px 40px;
    gap: 8px;
  }
  
  .image-view {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 480px) {
  .file-content {
    padding: 16px;
  }
  
  .grid-view {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .list-header {
    display: none;
  }
  
  .list-item {
    grid-template-columns: 1fr auto;
    gap: 12px;
  }
  
  .list-col.size,
  .list-col.date {
    display: none;
  }
}
</style> 