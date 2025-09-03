import axios from "axios";

export const useAxiosDELETE = (request) => {
  const { baseURL } = useRuntimeConfig();

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
  return axios.delete(`${request}`, {
    baseURL,
    headers: {
      // Если нужно
    },
  });
};
