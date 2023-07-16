import axios from 'axios'
import { message } from 'ant-design-vue'

export const Service = axios.create({
  // baseURL: process.env.BASE_URL, // 后端的api的baseurl服务地址
  timeout: 60000 // 请求超时时间
})

switch (document.documentElement.dataset.vanEnv) {
  case "dev":
    Service.defaults.baseURL = "/arcade-x6-api";
    break;
  case "stg":
    Service.defaults.baseURL ="https://arcade-x6-api-stg.work";
    break;
  case "pre":
    Service.defaults.baseURL = "https://arcade-x6-api-pre.work";
    break;
  case "prod":
    Service.defaults.baseURL = "https://arcade-x6-api.work";
    break;
  default:
    // 本地开发时会走到 default
    Service.defaults.baseURL = "/arcade-x6-api";
}

// 添加请求拦截器
Service.interceptors.request.use(config => {
  // let token = localStorage.getItem('token')
  // token ? param.headers.token = token : param.headers.token = '1111'
  return config
},
error => {
  Promise.reject(error)
})

// 添加响应拦截器
Service.interceptors.response.use(response => {
  return response.data
}, error => {
  const msg = error.message !== undefined ? error.message : ''
  message.error('数据获取失败 ' + msg)
  return Promise.reject(error)
})
