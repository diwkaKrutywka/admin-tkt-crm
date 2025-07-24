import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// Основные маршруты
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "AdminView",
    component: () => import("../views/AdminView.vue"),
    redirect: "/main",
    children: [
      {
        path: "user/all",
        name: "UserList",
        component: () => import("../views/user/UserList.vue"),
      },
      {
        path: "/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/LoginView.vue"),
      },
      {
        path: "main",
        name: "MainView",
        component: () => import("../views/main/MainView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
