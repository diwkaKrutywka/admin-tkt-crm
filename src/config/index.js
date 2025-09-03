function getBaseUrl() {
    // Используем переменную окружения, если доступна, иначе fallback
    return import.meta.env.VITE_BASE_URL || "";
    // return "http://10.100.0.61:8030/";
  }
  
  const baseUrl = {
    baseURL: getBaseUrl(),
  };
  
  export default baseUrl;
  