import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'


// Основные маршруты
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'AdminView',
    component: () => import('../views/AdminView.vue'),
    redirect: '/user/all',
    children: [
      {
        path: 'user/all', // не начинай с `/` внутри children
        name: 'UserList',
        component: () => import('../views/user/UserList.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
