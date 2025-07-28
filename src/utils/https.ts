import axios from "axios";
import { notification } from "ant-design-vue";
import config from "../config";
import { useUserStore } from "../store/index";

// Create base instance
const Service = axios.create({
  baseURL: config.baseURL,
  timeout: 30000,
  headers: {
    "ngrok-skip-browser-warning": "69420",
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 🧩 Request Interceptor: attach access token
Service.interceptors.request.use((config) => {
  const userStore = useUserStore();

  if (userStore.accessToken) {
    config.headers.Authorization = `Bearer ${userStore.accessToken}`;
  }

  return config;
});

// 🔁 Response Interceptor: refresh token on 401
let isRefreshing = false;
let failedQueue: any[] = [];

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
  async (error) => {
    const userStore = useUserStore();
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (!userStore.refreshToken) {
        notification.error({
          message: "Сессия истекла. Выполните вход снова.",
        });
        userStore.clearUser();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return Service(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
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

        userStore.setUser({
          ...userStore.user,
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
          session_token: userStore.sessionToken,
          user: userStore.user,
        });

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return Service(originalRequest);
      } catch (err) {
        processQueue(err, null);
        userStore.clearUser();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default Service;
