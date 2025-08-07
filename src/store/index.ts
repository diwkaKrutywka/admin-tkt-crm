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

export const useUserStore = defineStore("userInfo", {
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
  getters: {
    userViews: (state): UserView[] => {
      return state.usersList.map((user) => ({
        id: user.id,
        fullName: user.full_name,
        role: user.user_role,
        organization: user.organization_name,
        isActive: user.is_active,
        lastLogin: user.last_login_at,
        organization_id: user.organization_id,
      }));
    },
  },
  actions: {
    setDashboardData(data) {
      this.statisticsDashboardData = data.dashboardData.cards?.filter(
        (card) => card.category === "statistics"
      );
      this.informationDashboardData = data.dashboardData.cards?.filter(
        (card) => card.category === "information"
      );
    },

    signOut() {
      this.user = {};
    },
    setUser(user) {
      this.user = user.user; // Save the whole object
      console.log(user, "user");
      this.accessToken = user.access_token;
      this.refreshToken = user.refresh_token;
      localStorage.setItem("accessToken", user.access_token);
    },
    setUsersList(data) {
      // сохраняем мете данные для пагинаций
      const { users, ...metaData } = data;
      this.pagination = metaData;
      this.usersList = data.users;

      // сортируем активных и неактивных пользователей, а так же их организаций
      this.activeUsers = data.users.filter((item) => item.is_active);
      this.inactiveUsers = data.users.filter((item) => !item.is_active);
      this.organizations = [
        ...new Set(data.users.map((item) => item.organization_name)),
      ];
    },
    clearUser() {
      this.accessToken = "";
      this.refreshToken = "";
      this.sessionToken = "";
      this.user = null;
    },
  },
})


export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLang: localStorage.getItem('currentLang') || 'kk'
  }),
  actions: {
    setLang(lang: string) {
      this.currentLang = lang
      localStorage.setItem('currentLang', lang)
    }
  }
})

interface NotificationMessage {
  title?: string
  body?: string
  data?: any
  timestamp: number
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    messages: [] as NotificationMessage[],
  }),
  actions: {
    addMessage(message: NotificationMessage) {
      this.messages.unshift({ ...message, timestamp: Date.now() })
    },
    clearMessages() {
      this.messages = []
    },
    removeMessageByAppealId(appealId: string) {
      this.messages = this.messages.filter(
        (msg) => msg.data?.appeal_id !== appealId
      )
    },
  },
})
