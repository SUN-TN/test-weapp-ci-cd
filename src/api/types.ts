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

/**
 * 响应结果基础数据结构
 */
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 列表响应数据基础数据结构
 */
export interface ListResponseData<T> extends ResponseData {
  data: {
    list: T[];
    // 分页信息，空数据时仍返回完整结构
    pagination: {
      pageNum: number;
      pageSize: number;
      total: number; // 总条数，空数据时为0
      totalPage: number; // 总页数，空数据时为0
    };
  };
}

/**
 * 排序规则
 */
export type SortDirection = 'ASC' | 'DESC';

/**
 * 排序配置项
 */
export interface Sort {
  filed: string;
  direction: SortDirection;
}

/**
 * 列表请求数据结构
 */
export interface ListRequestData<T extends Record<string, any>> {
  filter: T;
  pagination?: {
    // 必选，分页参数，统一命名规范
    pageNum: number; // 当前页码，默认1，最小值1
    pageSize: number; // 每页条数，默认10，最大值100（防止查询压力过大）
  };
  sort?: Sort[];
}

// 错误类型
export interface ApiError extends AxiosError<ResponseData> {
  config: RequestConfig & InternalAxiosRequestConfig;
}

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
