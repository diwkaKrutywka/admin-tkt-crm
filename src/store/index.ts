import { defineStore } from "pinia";
import type {
  UserDto,
  UserView,
  pagination,
} from "../interfaces/user.interface";
import { paginationConfig } from "ant-design-vue/es/pagination";
interface User {
  id: string;
  username: string;
  full_name: string;
  department: string;
  position: string;
  user_role: string;
  organization_name: string;
  [key: string]: any; // For other optional props
}

interface UserPayload {
  access_token: string;
  refresh_token: string;
  session_token?: string;
  user: User;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    pagination: {} as pagination,
    statisticsDashboardData: [],
    informationDashboardData: [],
    dashboardData: {},
    activeUsers: [],
    usersList: [] as UserDto[],
    inactiveUsers: [],
    organizations: [],
    accessToken: "",
    refreshToken: "",
    sessionToken: "",
    user: null as User | null,
  }),
  actions: {
    init() {
      // Инициализируем токены из localStorage при создании store
      this.getUserInfo();
    },
    getUserInfo() {
      if (localStorage.getItem("accessToken")) {
        this.accessToken = localStorage.getItem("accessToken") as string;
        this.refreshToken = localStorage.getItem("refreshToken") as string;
        this.sessionToken = localStorage.getItem("sessionToken") as string;
      }
    },
    setUser(payload: UserPayload) {
      this.accessToken = payload.access_token;
      this.refreshToken = payload.refresh_token;
      this.sessionToken = payload.session_token || "";
      this.user = payload.user;
      localStorage.setItem("accessToken", payload.access_token);
      localStorage.setItem("refreshToken", payload.refresh_token);
      if (payload.session_token) {
        localStorage.setItem("sessionToken", payload.session_token);
      }
    },
    clearUser() {
      this.accessToken = "";
      this.refreshToken = "";
      this.sessionToken = "";
      this.user = null;
      // Очищаем localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("sessionToken");
    },
    logout() {
      this.clearUser();
      // Возвращаем true для индикации того, что нужно перенаправить
      return true;
    },
  },
});

export const useLanguageStore = defineStore("language", {
  state: () => ({
    currentLang: localStorage.getItem("currentLang") || "kk",
  }),
  actions: {
    setLang(lang: string) {
      this.currentLang = lang;
      localStorage.setItem("currentLang", lang);
    },
  },
});

interface NotificationMessage {
  title?: string;
  body?: string;
  data?: any;
  timestamp: number;
}

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    messages: [] as NotificationMessage[],
  }),
  actions: {
    addMessage(message: NotificationMessage) {
      this.messages.unshift({ ...message, timestamp: Date.now() });
    },
    clearMessages() {
      this.messages = [];
    },
    removeMessageByAppealId(appealId: string) {
      this.messages = this.messages.filter(
        (msg) => msg.data?.appeal_id !== appealId
      );
    },
  },
})
