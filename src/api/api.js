import http from "../utils/http";

export function ApiApi(url, data, method) {
  let info = {
    url: 'auth/'+  url ,
  };
  if (method == "GET") {
    info["method"] = "GET";
  } else {
    info["method"] = "POST";
    info["data"] = data;
  }
  return http(info);
}
