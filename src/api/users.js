import http from "../utils/http";

export function users(url, data, method) {
  let info = {
    url: 'users/'+  url ,
  };
  if (method == "GET") {
    info["method"] = "GET";
  } else {
    info["method"] = "POST";
    info["data"] = data;
  }
  return http(info);
}
