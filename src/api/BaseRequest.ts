/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { showToast, showLoading, hideLoading } from '@tarojs/taro';
import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import { getDefaultConfig } from './config';
import type { ApiError, HttpMethod, RequestConfig, RequestMethodConfig, ResponseData } from './types';

export type GetIsReturnFullResponse<R extends RequestMethodConfig | undefined = undefined> = R extends {
  returnFullResponse: true;
}
  ? true
  : R extends { returnFullResponse: false }
    ? false
    : false;

export type GetReturnType<D = any, C extends RequestMethodConfig | undefined = undefined> = Promise<
  GetIsReturnFullResponse<C> extends true ? AxiosResponse<ResponseData<D>> : D
>;

const defaultReturnFullResponse = false;
export default class BaseRequest<InstanceConfig extends RequestConfig | undefined = undefined> {
  config: InstanceConfig;
  instance: AxiosInstance;

  constructor(config?: InstanceConfig) {
    this.config = config ?? (getDefaultConfig() as InstanceConfig);
    this.instance = axios.create(this.config);
    this.initInterceptors();
  }

  private initInterceptors = () => {
    // 请求处理
    this.instance.interceptors.request.use(
      (config) => {
        /**
         * 添加 Authorization
         */
        const accessToken = localStorage.getItem('token') ?? '';

        config.headers = Object.assign(config?.headers, {
          Authorization: 'Bearer ' + accessToken,
        });

        return config;
      },
      async (error: AxiosError) => {
        return await Promise.reject(error);
      },
    );

    // 响应处理
    this.instance.interceptors.response.use(
      (res: AxiosResponse<ResponseData>) => {
        const { data } = res;

        if (data instanceof Blob) {
          return res;
        }

        const { code, errors } = data;
        const message = errors?.[0]?.message

        switch (code) {
          case 401: {
            /**
             * 返回登录页面
             */
            if (confirm('登录已过期, 请重新登录')) {
              window.location.href = '/auth/login';
            }

            return res;
          }
          case 200:
          case 201:
          case 204:
          case 0:
            return res;
          default:
            throw new Error(message || '系统错误');
        }
      },
      (error: ApiError) => {
        const { showError } = error.config;
        const { status, code, message: errMsg } = error;
        const codeMessage: Record<number, string> = {
          400: '400 - 错误请求! ',
          401: '401 - 用户没有权限! ',
          403: '403 - 拒绝访问! ',
          404: '404 - 请求错误, 未找到该资源! ',
          405: '405 - 请求方法未允许! ',
          500: '500 - 服务器发生错误，请检查服务器! ',
          502: '502 - 服务器发生错误，请检查服务器! ',
          503: '503 - 服务不可用，服务器暂时过载或维护! ',
          504: '504 - 连接超时!',
        };
        let defaultMessage = '';
        if (code === 'ECONNABORTED' || errMsg === 'Network Error' || errMsg.includes('timeoutF')) {
          defaultMessage = '网络超时，请稍后重试';
        } else {
          defaultMessage = codeMessage[status!] || '系统错误';
        }
        // 如果后端有返回内容
        const backendMsg = error?.response?.data?.errors?.[0]?.message;
        const msg = backendMsg ?? defaultMessage;

        if (showError) {
          showToast({title:msg});
        }
        return Promise.reject(error);
      },
    );
  };

  /**
   * 处理响应数据
   */
  private handleResponse<D = any>(
    response: AxiosResponse,
    returnFullResponse?: boolean,
  ): AxiosResponse<ResponseData<D>> | D {
    const shouldReturnFull = returnFullResponse ?? defaultReturnFullResponse;

    /** 如果返回完整响应，直接返回axios响应 */
    if (shouldReturnFull) {
      return response as AxiosResponse<ResponseData<D>>;
    }

    /** 否则，返回标准响应数据格式 */
    return (response as AxiosResponse<ResponseData<D>>).data.data;
  }

  // 函数重载1：不传 config 的情况，默认返回数据
  async request<D = any>(url: string, method?: HttpMethod, data?: any): Promise<D>;
  // 函数重载2：传 config 且 returnFullResponse: true 的情况
  async request<D = any>(
    url: string,
    method?: HttpMethod,
    data?: any,
    config?: RequestMethodConfig & { returnFullResponse: true },
  ): Promise<AxiosResponse<ResponseData<D>>>;
  // 函数重载3：传 config 且 returnFullResponse: false 或未设置的情况
  async request<D = any>(url: string, method?: HttpMethod, data?: any, config?: RequestMethodConfig): Promise<D>;
  // 实现方法
  async request<D = any>(url: string, method: HttpMethod = 'GET', data?: any, config?: RequestMethodConfig) {
    const requestConfig: RequestMethodConfig = {
      url,
      method,
      ...this.config,
      ...config,
    };

    // 根据请求方法设置参数
    if (['GET', 'HEAD', 'DELETE', 'OPTIONS'].includes(requestConfig.method!.toUpperCase())) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      requestConfig.params = data;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      requestConfig.data = data;
    }
    const { showLoading:autoShowLoading } = requestConfig;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      autoShowLoading && showLoading();
      const res = await this.instance.request(requestConfig);
      return this.handleResponse<D>(res, requestConfig?.returnFullResponse);
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      autoShowLoading && hideLoading();
    }
  }

  // 函数重载1：不传 config 的情况，默认返回数据
  async get<D = any>(url: string, params?: Record<string, any>): Promise<D>;
  // 函数重载2：传 config 且 returnFullResponse: true 的情况
  async get<D = any>(
    url: string,
    params?: Record<string, any>,
    config?: RequestMethodConfig & { returnFullResponse: true },
  ): Promise<AxiosResponse<ResponseData<D>>>;
  // 函数重载3：传 config 且 returnFullResponse: false 或未设置的情况
  async get<D = any>(url: string, params?: Record<string, any>, config?: RequestMethodConfig): Promise<D>;
  // 实现方法
  async get<D = any>(url: string, params?: Record<string, any>, config?: RequestMethodConfig) {
    return this.request<D>(url, 'GET', params, config);
  }

  // 函数重载1：不传 config 的情况，默认返回数据
  async post<D = any>(url: string, data?: any): Promise<D>;
  // 函数重载2：传 config 且 returnFullResponse: true 的情况
  async post<D = any>(
    url: string,
    data?: any,
    config?: RequestMethodConfig & { returnFullResponse: true },
  ): Promise<AxiosResponse<ResponseData<D>>>;
  // 函数重载3：传 config 且 returnFullResponse: false 或未设置的情况
  async post<D = any>(url: string, data?: any, config?: RequestMethodConfig): Promise<D>;
  // 实现方法
  async post<D = any>(url: string, data?: any, config?: RequestMethodConfig) {
    return this.request<D>(url, 'POST', data, config);
  }

  // 函数重载1：不传 config 的情况，默认返回数据
  async put<D = any>(url: string, data?: any): Promise<D>;
  // 函数重载2：传 config 且 returnFullResponse: true 的情况
  async put<D = any>(
    url: string,
    data?: any,
    config?: RequestMethodConfig & { returnFullResponse: true },
  ): Promise<AxiosResponse<ResponseData<D>>>;
  // 函数重载3：传 config 且 returnFullResponse: false 或未设置的情况
  async put<D = any>(url: string, data?: any, config?: RequestMethodConfig): Promise<D>;
  // 实现方法
  async put<D = any>(url: string, data?: any, config?: RequestMethodConfig) {
    return this.request<D>(url, 'PUT', data, config);
  }

  // 函数重载1：不传 config 的情况，默认返回数据
  async delete<D = any>(url: string, params?: any): Promise<D>;
  // 函数重载2：传 config 且 returnFullResponse: true 的情况
  async delete<D = any>(
    url: string,
    params?: any,
    config?: RequestMethodConfig & { returnFullResponse: true },
  ): Promise<AxiosResponse<ResponseData<D>>>;
  // 函数重载3：传 config 且 returnFullResponse: false 或未设置的情况
  async delete<D = any>(url: string, params?: any, config?: RequestMethodConfig): Promise<D>;
  // 实现方法
  async delete<D = any>(url: string, params?: any, config?: RequestMethodConfig) {
    return this.request<D>(url, 'DELETE', params, config);
  }

  // 函数重载1：不传 config 的情况，默认返回数据
  async patch<D = any>(url: string, data?: any): Promise<D>;
  // 函数重载2：传 config 且 returnFullResponse: true 的情况
  async patch<D = any>(
    url: string,
    data?: any,
    config?: RequestMethodConfig & { returnFullResponse: true },
  ): Promise<AxiosResponse<ResponseData<D>>>;
  // 函数重载3：传 config 且 returnFullResponse: false 或未设置的情况
  async patch<D = any>(url: string, data?: any, config?: RequestMethodConfig): Promise<D>;
  // 实现方法
  async patch<D = any>(url: string, data?: any, config?: RequestMethodConfig) {
    return this.request<D>(url, 'PATCH', data, config);
  }

  // 函数重载1：不传 config 的情况，默认返回数据
  async head<D = any>(url: string, params?: any): Promise<D>;
  // 函数重载2：传 config 且 returnFullResponse: true 的情况
  async head<D = any>(
    url: string,
    params?: any,
    config?: RequestMethodConfig & { returnFullResponse: true },
  ): Promise<AxiosResponse<ResponseData<D>>>;
  // 函数重载3：传 config 且 returnFullResponse: false 或未设置的情况
  async head<D = any>(url: string, params?: any, config?: RequestMethodConfig): Promise<D>;
  // 实现方法
  async head<D = any>(url: string, params?: any, config?: RequestMethodConfig) {
    return this.request<D>(url, 'HEAD', params, config);
  }

  // 函数重载1：不传 config 的情况，默认返回数据
  async options<D = any>(url: string, params?: any): Promise<D>;
  // 函数重载2：传 config 且 returnFullResponse: true 的情况
  async options<D = any>(
    url: string,
    params?: any,
    config?: RequestMethodConfig & { returnFullResponse: true },
  ): Promise<AxiosResponse<ResponseData<D>>>;
  // 函数重载3：传 config 且 returnFullResponse: false 或未设置的情况
  async options<D = any>(url: string, params?: any, config?: RequestMethodConfig): Promise<D>;
  // 实现方法
  async options<D = any>(url: string, params?: any, config?: RequestMethodConfig) {
    return this.request<D>(url, 'OPTIONS', params, config);
  }
}
