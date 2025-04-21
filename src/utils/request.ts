import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { setStore } from "@/stores";

// 定义响应数据的接口
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 声明 Chrome 类型
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        id?: string
      }
    }
  }
}

// 检查是否在 Chrome 扩展环境中运行
const isChromeExtension = window.chrome?.runtime?.id !== undefined;

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在 Chrome 扩展环境中，添加必要的请求头
    if (isChromeExtension) {
      config.headers = {
        ...config.headers,
        "Accept": "application/json",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      } as any;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.error("响应错误:", error);
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 400:
          console.error('请求错误');
          break;
        case 401:
          console.error('未授权，请重新登录');
          break;
        case 403:
          console.error('拒绝访问');
          break;
        case 404:
          console.error('请求错误，未找到该资源');
          break;
        case 500:
          console.error('服务器端出错');
          break;
        default:
          console.error(`连接错误${error.response.status}`);
      }
    } else {
      // 请求超时或网络错误
      if (error.message.includes('timeout')) {
        console.error('请求超时，请检查网络连接');
      } else {
        console.error('网络错误，请检查网络连接');
      }
    }
    return Promise.reject(error);
  }
);

// 封装 GET 请求
export const get = <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return request({
    method: 'get',
    url,
    params,
    ...config,
  });
};

// 封装 POST 请求
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return request({
    method: 'post',
    url,
    data,
    ...config,
  });
};

export default request; 