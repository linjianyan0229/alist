<template>
  <div id="app">
    <router-view 
      :view-mode="viewMode"
      :current-path="currentPath"
      @view-change="handleViewChange"
      @update-path="handlePathUpdate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 视图模式状态
const viewMode = ref('grid')

// 当前路径状态
const currentPath = ref('')

// 处理视图切换
const handleViewChange = (mode) => {
  viewMode.value = mode
  // 通过事件总线通知Home组件
  window.dispatchEvent(new CustomEvent('view-change', { detail: mode }))
}

// 处理路径更新
const handlePathUpdate = (path) => {
  currentPath.value = path
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
