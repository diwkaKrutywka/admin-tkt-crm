import axios from "axios";

export const useAxiosGET = (request, data) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Axios interceptor
  axios.interceptors.response.use(
    (response) => {
      if (response.status === 200) {
        return response;
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axios.get(`${request}`, {
    baseURL,
    params: { ...data },
    headers: {
      // Если нужно
    },
  });
};
