import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { h, resolveComponent } from 'vue'


// Основные маршруты
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'AdminView',
    component: () => import('../views/AdminView.vue'),
    redirect: '/main',
    children: [
      {
        path: 'user/all', 
        name: 'UserList',
        component: () => import('../views/user/UserList.vue')
      },
      {
        path: 'contacts', 
        name: 'ContactList',
        component: () => import('../views/contacts/ContactView.vue')
      },
      {
        path: 'appeals', 
        name: 'AppealList',
        component: () => import('../views/appeal/AppealList.vue')
      },
      {
        path: 'main', 
        name: 'MainView',
        component: () => import('../views/main/MainView.vue')
      },
      {
        path: '/settings',
        name: 'RefView',
        component: () => import('../views/refs/RefView.vue'),
        redirect: '/settings/regions',
        children: [
          {
            path: 'regions',
            name: 'RegionView',
            component: () => import('../views/refs/regions/RegionsView.vue')
          },
          // {
          //   path: 'cities',
          //   name: 'CitiesView',
          //   component: () => import('../views/refs/cities/CitiesView.vue')
          // },
          // {
          //   path: 'districts',
          //   name: 'DistrictsView',
          //   component: () => import('../views/refs/districts/DistrictsView.vue')
          // },
          // добавь остальные табы
        ]
      }
      
      
    ]
  },
  {
    path: '/login',
    name: 'LoginView',
    component: () => import('../views/LoginView.vue'),
    children: []
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
