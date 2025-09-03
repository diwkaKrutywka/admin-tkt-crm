import axios from "axios";
import { notification } from "ant-design-vue";
import config from "../config";
import { useUserStore } from "../store/index";
import { useLanguageStore } from "../store/index";

// Создание базового инстанса
const Service = axios.create({
  baseURL: config.baseURL,
  timeout: 30000,
  headers: {
    "ngrok-skip-browser-warning": "69420",
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 🧩 Request Interceptor: добавляем токен и язык
Service.interceptors.request.use((config) => {
  const userStore = useUserStore();
  const languageStore = useLanguageStore();

  // Токен
  if (userStore.accessToken) {
    config.headers.Authorization = `Bearer ${userStore.accessToken}`;
  }

  // Язык
  if (languageStore.currentLang) {
    config.headers["Accept-Language"] = languageStore.currentLang as
      | "kk"
      | "ru"
      | "en";
  }

  return config;
});

// 🔁 Response Interceptor: обработка 401 и рефреш токена
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

Service.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const userStore = useUserStore();
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Если это запрос на refresh токен, то сразу выходим
      if (originalRequest.url?.includes('/refresh')) {
        userStore.logout();
        // Перенаправляем на страницу входа
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Если нет refresh токена, то выходим
      if (!userStore.refreshToken) {
        notification.error({
          message: "Сессия истекла. Выполните вход снова.",
        });
        userStore.logout();
        // Перенаправляем на страницу входа
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Если уже идет процесс обновления токена, добавляем в очередь
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return Service(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${config.baseURL}/api/v1/auth/refresh`,
          {
            refresh_token: userStore.refreshToken,
          }
        );

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        if (userStore.user) {
          userStore.setUser({
            ...userStore.user,
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
            session_token: userStore.sessionToken,
            user: userStore.user,
          });
        }

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return Service(originalRequest);
      } catch (err) {
        processQueue(err, null);
        
        // Если refresh токен тоже недействителен, очищаем стор и перенаправляем на логин
        notification.error({
          message: "Сессия истекла. Выполните вход снова.",
        });
        userStore.logout();
        // Перенаправляем на страницу входа
        window.location.href = '/login';
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default Service;
