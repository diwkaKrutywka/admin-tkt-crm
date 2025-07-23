import axios from "axios";
// import store from "../store/index.ts";
import { notification } from "ant-design-vue";
import config from "../config";

const Service = axios.create({
  timeout: 10000 * 3,
  baseURL: config.baseURL,
  headers: {
    "ngrok-skip-browser-warning": "69420",
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: `Bearer ${
      localStorage.getItem("accessToken")
        ? localStorage.getItem("accessToken")
        : ""
    }`,
  },
});

export default Service;
