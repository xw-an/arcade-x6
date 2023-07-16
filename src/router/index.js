import { createRouter, createWebHashHistory } from 'vue-router'
const originalPush = createRouter.prototype.push
createRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    name: 'BaseLayout',
    redirect: '/tools',
    component: () => import('@/layouts/BaseLayout'),
    children: [
      {
        path: '/tools',
        name: '工具列表',
        component: () => import('@/views/tools/ToolsList'),
        meta: {requireAuth: true}
      },
      {
        path: '/tools/detail/:id',
        name: '工具详情',
        component: () => import('@/views/tools/ToolDetail'),
        meta: {requireAuth: true}
      },
      {
        path: '/flows',
        name: '工具流程',
        component: () => import('@/views/flows/FlowsList'),
        meta: {requireAuth: true}
      },
      {
        path: '/flows/detail/:name/:processInstanceId',
        name: '流程详情',
        component: () => import('@/views/flows/FlowDetail'),
        meta: {requireAuth: true}
      },
      {
        path: '/flows/log/:name/:versionId/:processInstanceId/:taskId',
        name: '日志详情',
        component: () => import('@/views/flows/FlowLogs'),
        meta: {requireAuth: true}
      },
      {
        path: '/task',
        name: '任务管理',
        component: () => import('@/views/task/TaskList'),
        meta: {requireAuth: true}
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
