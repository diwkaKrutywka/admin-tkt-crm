function getBaseUrl() {
    return "https://proper-especially-lab.ngrok-free.app/";
   // return "http://10.100.0.61:8030/";
  }
  
  const baseUrl = {
    nakedBaseURL: getBaseUrl(),
    baseURL: getBaseUrl() + "api/v1",
  };
  
  export default baseUrl;
  