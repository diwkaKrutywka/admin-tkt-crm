import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useUserStore } from "../store";

// Расширяем типы для meta полей
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresQuery?: string[];
  }
}

// Основные маршруты
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "AdminView",
    component: () => import("../views/AdminView.vue"),
    redirect: "/main",
    meta: { requiresAuth: true }, // Требует аутентификации
    children: [
      {
        path: "user/all",
        name: "UserList",
        component: () => import("../views/user/UserList.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "contacts",
        name: "ContactList",
        component: () => import("../views/contacts/ContactView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "bp/:id",
        name: "bp",
        component: () => import("../views/brightPattern/FormView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "appeals",
        name: "AppealList",
        component: () => import("../views/appeal/AppealList.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "main",
        name: "MainView",
        component: () => import("../views/main/MainView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "ticket",
        name: "TicketView",
        component: () => import("../views/ticket/TicketView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/settings",
        name: "RefView",
        component: () => import("../views/refs/RefView.vue"),
        redirect: "/settings/regions",
        meta: { requiresAuth: true },
        children: [
          {
            path: "regions",
            name: "RegionView",
            component: () => import("../views/refs/regions/RegionsView.vue"),
            meta: { requiresAuth: true },
          },

          {
            path: "cities",
            name: "CitiesView",
            component: () => import("../views/refs/city/CityView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "districts",
            name: "DistrictsView",
            component: () => import("../views/refs/districts/DistrictView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "addresses",
            name: "AddressesView",
            component: () => import("../views/refs/addresses/AddressView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "streets",
            name: "StreetsView",
            component: () => import("../views/refs/streets/StreetView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "types",
            name: "CallTypesView",
            component: () =>
              import("../views/refs/call-types/CallTypeView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "subtypes",
            name: "CallSubtypesView",
            component: () =>
              import("../views/refs/subtypes/CallSubtypesView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "complaint_status",
            name: "ComplaintStatusView",
            component: () =>
              import("../views/refs/statuses/ComplaintStatusView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "complaint_categories",
            name: "ComplaintCategoriesView",
            component: () =>
              import("../views/refs/categories/ComplaintCategoriesView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "complaint_subcategories",
            name: "ComplaintSubcategoriesView",
            component: () =>
              import(
                "../views/refs/subcategories/ComplaintSubcategoriesView.vue"
              ),
            meta: { requiresAuth: true },
          },
          {
            path: "districts",
            name: "DistrictsView",
            component: () => import("../views/refs/districts/DistrictView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "addresses",
            name: "AddressesView",
            component: () => import("../views/refs/addresses/AddressView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "streets",
            name: "StreetsView",
            component: () => import("../views/refs/streets/StreetView.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "types",
            name: "CallTypesView",
            component: () =>
              import("../views/refs/call-types/CallTypeView.vue"),
            meta: { requiresAuth: true },
          },

          {
            path: "organizations",
            name: "OrganizationsView",
            component: () =>
              import("../views/refs/organizations/OrganizationView.vue"),
            meta: { requiresAuth: true },
          },
        ],
      },
    ],
  },
  {
    path: "/bp",
    name: "BusinessProcess",
    component: () => import("../views/brightPattern/FormView.vue"),
    // Можно добавить мета-информацию для валидации query параметров
    meta: {
      requiresQuery: ["bp_giid"], // Обязательные query параметры
    },
  },
  {
    path: "/login",
    name: "LoginView",
    component: () => import("../views/LoginView.vue"),
    children: [],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard для проверки аутентификации
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();
  
  // Если маршрут требует аутентификации
  if (to.meta.requiresAuth) {
    // Проверяем наличие токена
    if (!userStore.accessToken) {
      // Если токена нет, перенаправляем на страницу входа
      next('/login');
      return;
    }
  }
  
  // Если пользователь авторизован и пытается зайти на страницу входа
  if (to.path === '/login' && userStore.accessToken) {
    // Перенаправляем на главную страницу
    next('/');
    return;
  }
  
  next();
});

export default router;
