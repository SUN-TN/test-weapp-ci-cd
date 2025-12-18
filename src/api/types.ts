/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

/**
 * 请求配置，继承于Axios请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
  /**
   * 是否在请求中显示Loading 默认false
   * @default false
   */
  showLoading?: boolean;

  /**
   * 是否在请求失败时显示错误提示 默认 true
   * @default true
   */
  showError?: boolean;
}

/**
 * 请求方法配置
 */
export interface RequestMethodConfig extends RequestConfig {
  /**
   *  是否返回完成的请求结果 默认为false
   */
  returnFullResponse?: boolean;
}

export interface ErrorItem {
  code: number;
  filed?: string;
  message: string;
}

/**
 * 响应结果基础数据结构
 */
export interface ResponseData<T = any> {
  code: number;
  data: T;
  errors?: ErrorItem[];
  warnings?: ErrorItem[];
}

/**
 * 列表响应数据基础数据结构
 */
export interface ListResponseData<T> extends ResponseData {
  data: {
    items: T[];
    total: number;
  };
}

// 错误类型
export interface ApiError extends AxiosError<ResponseData> {
  config: RequestConfig & InternalAxiosRequestConfig;
}

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
