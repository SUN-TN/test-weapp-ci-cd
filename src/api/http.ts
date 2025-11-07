import axios, { AxiosError, AxiosInstance } from "axios";
import { showToast } from "@tarojs/taro";
import qs from "qs";
import type {
  CustomAxiosRequestConfig,
  CustomAxiosRequestHeaders,  
  FetchResult,
} from "@/types/axios";
import process from "process";
import preventRequest from "@/utils/preventRequest";

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  400: "400 - 错误请求! ",
  401: "401 - 用户没有权限! ",
  403: "403 - 拒绝访问! ",
  404: "404 - 请求错误, 未找到该资源! ",
  405: "405 - 请求方法未允许! ",
  500: "500 - 服务器发生错误，请检查服务器! ",
  502: "502 - 服务器发生错误，请检查服务器! ",
  503: "503 - 服务不可用，服务器暂时过载或维护! ",
  504: "504 - 连接超时!",
};
const toastMessage = (errorMsg: string) => {
  showToast({
    title: errorMsg,
    icon: "none",
    duration: 2000,
  });
};

// 请求拦截
const requestInterceptors = (service: AxiosInstance) => {
  service.interceptors.request.use(
    async (config: CustomAxiosRequestConfig) => {
      const headers = config.headers as CustomAxiosRequestHeaders;
      config.headers = Object.assign({}, config.headers);
      if (config.debug) {
        headers["mode"] = "debug";
      }
      if (config.source) {
        headers["source"] = config.source;
      }

      if (headers["Content-Type"] == "application/x-www-form-urlencoded") {
        const data = config.data || config.params || {};
        try {
          config.data = qs.stringify(data);
        } catch {}
      }

      //自动注入父应用token
      if (config.url && !/^http[s]?.+/.test(config.url)) {
        config.api = config.url; // 保留原代码中的接口连接 返回拦截中可能使用到
      }
      const newConfig = config as any;
      // 判断是否token过期
      const expire = false;
      if (!expire) {
        // 判断是token过期 走自动刷新token的流程 刷新后在自动调接口
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// 响应拦截
const responseInterceptors = (service: AxiosInstance, toast: boolean) => {
  service.interceptors.response.use(
    (response) => {
      preventRequest.removeRequest(response.config); // 在请求结束后移除本次请求
      // 如果是文件流直接返回
      // 小程序环境兼容处理：避免Blob对象不存在导致的错误
      if (
        response?.data &&
        typeof Blob !== "undefined" &&
        response.data instanceof Blob
      ) {
        return Promise.resolve(response);
      }
      // 如果是字符串直接返回
      if (Object.prototype.toString.call(response.data) !== "[object Object]") {
        return Promise.resolve(response);
      }
      if (response.data.code === 0) {
        return Promise.resolve(response.data);
      } else {
        const errorMsg = response.data.msg ?? response.data.message;
        toast && toastMessage(errorMsg);
        return Promise.reject(response);
      }
    },
    async (err: AxiosError) => {
      preventRequest.removeRequest(err.config); // 在请求失败后移除本次请求
      console.info("=========", err);
      if (err && err.response) {
        const response = err.response || {};
        const config = response.config as any;
        let toLoginPage = true;
        if (response.status === 401) {
          try {
            config.url = config.api; // 用原链接替换掉加了api的接口
            const isForm =
              config.headers["Content-Type"]?.indexOf(
                "application/x-www-form-urlencoded"
              ) > -1;
            // 格式化post请求的参数
            config.data = config.data
              ? isForm
                ? qs.parse(config.data)
                : JSON.parse(config.data)
              : {};
            if (config.api != "/oauth/token") {
              return "AccessToken"; // 1 代表是返回拦截 里面流程是axios(config)
            }
            toLoginPage =
              config.data.grant_type === "refresh_token" ||
              (config.api == "/oauth/token" && config.data.code == 401);
          } catch (e) {}
          if (toLoginPage) {
            toastMessage("登录失效，请重新登录");
            //跳转登录页
          }
        } else {
          const data = response.data as any;
          const msg =
            data?.msg || data?.error_msg || codeMessage[response.status];
          msg && toastMessage(msg);
          console.log(msg);
        }
        return Promise.reject(response);
      } else {
        if (
          err.code === "ECONNABORTED" ||
          err.message === "Network Error" ||
          err.message.includes("timeoutF")
        ) {
          toastMessage("网络超时，请稍后重试");
        }
        return Promise.reject(err);
      }
    }
  );
};

const initAxiosInstance = (config?: CustomAxiosRequestConfig) => {
  const service = axios.create();

  // 小程序环境适配：禁用withCredentials，避免cookie相关错误
  const isH5 = process.env.TARO_ENV === "h5";
  // 环境判断：小程序环境或开发环境
  const isDevelopment = isH5
    ? typeof window !== "undefined" && window.location.hostname === "localhost"
    : false;

  // 设置baseURL
  service.defaults.baseURL = isDevelopment
    ? "/api"
    : "http://192.168.31.112:3000";

  // 小程序环境下禁用withCredentials
  service.defaults.withCredentials = !isH5
    ? false
    : config?.withCredentials ?? true;
  service.defaults.timeout = config?.timeout || 30000;

  requestInterceptors(service);
  responseInterceptors(service, config?.toast ?? true);
  return service;
};

export default async function http<T = any, R = any>(
  url: string,
  method: "GET" | "DELETE" | "POST" | "PUT" | "PATCH",
  data?: object & { postQuery?: boolean },
  config?: CustomAxiosRequestConfig
) {
  // 添加公共参数
  const publicParams = {};
  const requestParams = Object.assign(publicParams, data);

  // 统一get和delete请求的params参数
  let params;
  const paramsOption = ["GET", "DELETE"];
  paramsOption.includes(method) && (params = requestParams);
  // post请求的params参数 兼容处理 避免手动在url中拼接参数
  if (data && data?.postQuery) {
    params = requestParams;
    delete requestParams.postQuery;
  }
  // 是否开启拦截重复请求
  if (config?.openPreventRequest) {
    const options: any = {
      url,
      method,
      data: requestParams,
      params,
      ...config,
    };
    // 是否含有重复请求队列
    if (preventRequest.checkRepeatRequest(options)) {
      return new Promise<FetchResult<T>>((resolve, reject) => {
        reject("cancelRequest");
      });
    }
    preventRequest.addRequest(options);
  }
  const axiosInstance = initAxiosInstance(config);
  const response = (await axiosInstance.request({
    url,
    method,
    data: requestParams,
    params,
    ...config,
  })) as FetchResult<T>;
  return response;
}

export const serviceInstance = initAxiosInstance();
// modifyMethods传参方式和post等一致 url,data,config
const modifyMethods = ["get", "delete"];
modifyMethods.forEach((key) => {
  serviceInstance[key] = (url, data, config) => {
    const transformData = {
      params: data,
      url: url,
      method: key,
      ...config,
    };
    return serviceInstance(transformData);
  };
});
