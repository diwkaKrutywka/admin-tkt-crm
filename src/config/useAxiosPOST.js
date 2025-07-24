import axios from "axios";
import config from "../config";

export const useAxiosPOST = (request, data) => {
  const baseURL = config.baseURL;
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
  return axios.post(`${request}`, data, {
    baseURL,
    headers: {
      // Если нужно
    },
  });
};
