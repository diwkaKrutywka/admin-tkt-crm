import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'



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
          {
            path: 'cities',
            name: 'CitiesView',
            component: () => import('../views/refs/city/CityView.vue')
          },
          {
            path: 'districts',
            name: 'DistrictsView',
            component: () => import('../views/refs/districts/DistrictView.vue')
          },
          {
            path: 'addresses',
            name: 'AddressesView',
            component: () => import('../views/refs/addresses/AddressView.vue')
          },
          {
            path: 'streets',
            name: 'StreetsView',
            component: () => import('../views/refs/streets/StreetView.vue')
          },
          {
            path: 'types',
            name: 'CallTypesView',
            component: () => import('../views/refs/call-types/CallTypeView.vue')
          },
          // {
          //   path: 'subtypes',
          //   name: 'CallSubtypesView',
          //   component: () => import('../views/refs/subtypes/CallSubtypesView.vue')
          // },
          // {
          //   path: 'complaint_status',
          //   name: 'ComplaintStatusView',
          //   component: () => import('../views/refs/statuses/ComplaintStatusView.vue')
          // },
          // {
          //   path: 'complaint_categories',
          //   name: 'ComplaintCategoriesView',
          //   component: () => import('../views/refs/categories/ComplaintCategoriesView.vue')
          // },
          // {
          //   path: 'complaint_subcategories',
          //   name: 'ComplaintSubcategoriesView',
          //   component: () => import('../views/refs/subcategories/ComplaintSubcategoriesView.vue')
          // },
          {
            path: 'organizations',
            name: 'OrganizationsView',
            component: () => import('../views/refs/organizations/OrganizationView.vue')
          }
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
