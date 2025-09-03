//const isRealTest = true

function getBaseUrl() {
  return "https://tight-wahoo-separately.ngrok-free.app/";
    // return "http://10.100.0.12:8002/";
}
 

const baseUrl = {
  nakedBaseURL: getBaseUrl(),
  baseURL: getBaseUrl(),
};

export default baseUrl;
