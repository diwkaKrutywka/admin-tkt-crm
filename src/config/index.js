//const isRealTest = true

function getBaseUrl() {
  return "https://proper-especially-lab.ngrok-free.app/";
}

const baseUrl = {
  nakedBaseURL: getBaseUrl(),
  baseURL: getBaseUrl() + "api/v1",
};

export default baseUrl;
