import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/index.vue'

export const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    name: 'home',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: '系统首页', icon: 'HomeFilled' },
    hidden: false,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: { title: '系统首页', icon: 'HomeFilled' },
        hidden: false,
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/dashboard.vue'),
      },
    ],
  },
  {
    path: '/forms',
    name: 'forms',
    component: Layout,
    redirect: '/forms/basicForm',
    meta: { title: '表单相关', icon: 'Document' },
    hidden: false,
    children: [
      {
        path: 'basicForm',
        name: 'basicForm',
        meta: { title: '基础表单' },
        hidden: false,
        component: () => import (/* webpackChunkName: "basicForm" */ '@/views/forms/basicForm.vue')
      },
      {
        path: 'upload',
        name: 'upload',
        meta: { title: '上传组件' },
        hidden: false,
        component: () => import (/* webpackChunkName: "upload" */ '@/views/forms/upload.vue')
      },
      {
        path: '',
        name: 'editor',
        redirect: '/forms/basicForm',
        meta: { title: '文本编辑器' },
        hidden: false,
        children: [
          {
            path: 'richTextEditor',
            name: 'richTextEditor',
            meta: { title: '富文本编辑器' },
            hidden: false,
            component: () => import (/* webpackChunkName: "richTextEditor" */ '@/views/forms/richTextEditor.vue')
          },
          {
            path: 'markdownEditor',
            name: 'markdownEditor',
            meta: { title: 'markdown编辑器' },
            hidden: false,
            component: () => import (/* webpackChunkName: "markdownEditor" */ '@/views/forms/markdownEditor.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/table',
    name: 'table',
    component: Layout,
    redirect: '/table/table1',
    meta: { title: '表格相关', icon: 'Calendar' },
    hidden: false,
    children: [
      {
        path: 'table1',
        name: 'table1',
        meta: { title: '表格1', icon: 'Calendar' },
        hidden: false,
        component: () => import(/* webpackChunkName: "table1" */ '@/views/table/table1.vue'),
      },
      {
        path: 'table2',
        name: 'table2',
        meta: { title: '表格2', icon: 'Calendar' },
        hidden: false,
        component: () => import(/* webpackChunkName: "table2" */ '@/views/table/table2.vue'),
      }
    ],
  },
  {
    path: '/icons',
    name: 'icons',
    component: Layout,
    meta: { title: '图标资源', icon: 'HelpFilled' },
    hidden: false,
    children: [
      {
        path: '',
        name: 'iconList',
        meta: { title: '图标资源', icon: 'HelpFilled' },
        hidden: false,
        component: () => import(/* webpackChunkName: "iconList" */ '@/views/icons/icons.vue'),
      }
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/login/login.vue'),
  },
  {
    path: '/error',
    name: 'Error',
    redirect: '/error/403',
    hidden: true,
    children: [
      {
        path: '403',
        name: '403',
        meta: { title: '没有权限' },
        hidden: true,
        component: () => import (/* webpackChunkName: "403" */ '@/views/errorPages/403.vue')
      },
      {
        path: '404',
        name: '404',
        meta: { title: '找不到页面' },
        hidden: true,
        component: () => import (/* webpackChunkName: "404" */ '@/views/errorPages/404.vue')
      }
    ]
  },
  // Catch all / 404 Not found Route must be placed at the end !!!
  { path: '/:pathMatch(.*)*', name: 'notFound', redirect: '/error/404', hidden: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
