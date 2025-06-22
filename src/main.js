import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'

// 导入页面组件
import Layout from './components/Layout.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'

// 导入认证工具
import { isAuthenticated } from './utils/auth.js'

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      title: '登录',
      requiresAuth: false 
    }
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    props: true,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { 
          title: '首页',
          requiresAuth: true 
        },
        props: true
      },
      // 可以在这里添加更多子路由
      // {
      //   path: 'users',
      //   name: 'Users',
      //   component: () => import('./views/Users.vue'),
      //   meta: { title: '用户管理', requiresAuth: true }
      // }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE || 'AList 管理系统'}`
  }

  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    if (isAuthenticated()) {
      // 如果已登录但访问登录页，重定向到首页
      if (to.path === '/login') {
        next('/')
      } else {
        next()
      }
    } else {
      // 未登录，重定向到登录页
      console.log('用户未登录，重定向到登录页')
      next('/login')
    }
  } else {
    // 不需要认证的页面
    if (isAuthenticated() && to.path === '/login') {
      // 已登录用户访问登录页，重定向到首页
      next('/')
    } else {
      next()
    }
  }
})

const app = createApp(App)

// 使用Element Plus
app.use(ElementPlus)

// 使用路由
app.use(router)

app.mount('#app')
