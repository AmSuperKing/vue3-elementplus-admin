import Layout from '../layout/index.vue'

const routes = [
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
    path: '/editor',
    name: 'editor',
    redirect: '/editor/markdownEditor',
    component: Layout,
    meta: { title: '编辑器', icon: 'EditPen' },
    hidden: false,
    children: [
      {
        path: 'markdownEditor',
        name: 'markdownEditor',
        meta: { title: 'Markdown编辑器', icon: 'Edit' },
        hidden: false,
        component: () => import(/* webpackChunkName: "markdownEditor" */ '@/views/editor/MarkdownEditor.vue'),
      },
      {
        path: 'richTextEditor',
        name: 'richTextEditor',
        meta: { title: '富文本编辑器', icon: 'Edit' },
        hidden: false,
        component: () => import(/* webpackChunkName: "richTextEditor" */ '@/views/editor/RichTextEditor.vue'),
      },
      {
        path: 'richTextEditor2',
        name: 'richTextEditor2',
        meta: { title: '富文本编辑器2', icon: 'Edit' },
        hidden: false,
        component: () => import(/* webpackChunkName: "richTextEditor2" */ '@/views/editor/RichTextEditor2.vue'),
      },
      {
        path: 'richTextEditor3',
        name: 'richTextEditor3',
        meta: { title: '富文本编辑器3', icon: 'Edit' },
        hidden: false,
        component: () => import(/* webpackChunkName: "richTextEditor3" */ '@/views/editor/RichTextEditor3.vue'),
      },
      {
        path: 'richTextEditor4',
        name: 'richTextEditor4',
        meta: { title: '富文本编辑器4', icon: 'Edit' },
        hidden: false,
        component: () => import(/* webpackChunkName: "richTextEditor4" */ '@/views/editor/RichTextEditor4.vue'),
      },
      {
        path: 'codeEditor',
        name: 'codeEditor',
        meta: { title: '代码编辑器', icon: 'Edit' },
        hidden: false,
        component: () => import(/* webpackChunkName: "codeEditor" */ '@/views/editor/CodeEditor.vue'),
      },
    ],
  },
  {
    path: '/fileViewer',
    name: 'fileViewer',
    redirect: '/fileViewer/pdfViewer',
    component: Layout,
    meta: { title: '文件查看器', icon: 'Document' },
    hidden: false,
    children: [
      {
        path: 'pdfViewer',
        name: 'pdfViewer',
        meta: { title: 'PDF查看器', icon: 'svg-pdf' },
        hidden: false,
        component: () => import(/* webpackChunkName: "fileViewer" */ '@/views/fileViewer/pdfViewer.vue'),
      },
      {
        path: 'officeViewer',
        name: 'officeViewer',
        meta: { title: 'Office查看器', icon: 'Reading' },
        hidden: false,
        component: () => import(/* webpackChunkName: "officeViewer" */ '@/views/fileViewer/officeViewer.vue'),
      },

    ],
  },
  {
    path: '/media',
    name: 'media',
    redirect: '/media/compress',
    component: Layout,
    meta: { title: '文件压缩', icon: 'PictureRounded' },
    hidden: false,
    children: [
      {
        path: 'compress',
        name: 'compress',
        meta: { title: '文件压缩', icon: 'PictureRounded' },
        hidden: false,
        component: () => import(/* webpackChunkName: "compress" */ '@/views/media/compress.vue'),
      },
    ],
  },
  {
    path: '/table',
    name: 'table',
    redirect: '/table/TableExample',
    component: Layout,
    meta: { title: '表格', icon: 'Grid' },
    hidden: false,
    children: [
      {
        path: 'TableExample',
        name: 'TableExample',
        meta: { title: '嵌套表格', icon: 'Grid' },
        hidden: false,
        component: () => import(/* webpackChunkName: "TableExample" */  '@/views/table/TableExample.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components',
    redirect: '/components/scrollbar',
    component: Layout,
    meta: { title: '组件', icon: 'Sunset' },
    hidden: false,
    children: [
      {
        path: 'scrollbar',
        name: 'scrollbar',
        meta: { title: '自定义滚动条', icon: 'Menu' },
        hidden: false,
        component: () => import(/* webpackChunkName: "ScrollbarUsageExample" */  '@/views/scrollbar/UsageExample.vue')
      }
    ]
  },
  {
    path: '/icons',
    name: 'icons',
    redirect: '/icons/list',
    component: Layout,
    meta: { title: '图标资源', icon: 'HelpFilled' },
    hidden: false,
    children: [
      {
        path: 'list',
        name: 'iconList',
        meta: { title: '图标资源', icon: 'HelpFilled' },
        hidden: false,
        component: () => import(/* webpackChunkName: "iconList" */ '@/views/icons/icons.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/login/index.vue'),
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
        component: () => import(/* webpackChunkName: "403" */ '@/views/errorPages/403.vue'),
      },
      {
        path: '404',
        name: '404',
        meta: { title: '找不到页面' },
        hidden: true,
        component: () => import(/* webpackChunkName: "404" */ '@/views/errorPages/404.vue'),
      },
    ],
  },
  // Catch all / 404 Not found Route must be placed at the end !!!
  { path: '/:pathMatch(.*)*', name: 'notFound', redirect: '/error/404', hidden: true },
]

export default routes
