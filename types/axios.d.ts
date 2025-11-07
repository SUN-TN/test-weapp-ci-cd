import { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios'

/**
 * 扩展请求配置
 */
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  /** 是否添加全屏loading */
  loading?: boolean
  /** 接口抛出异常时是否弹出toast */
  toast?: boolean
  /** 是否发送跨域请求时携带cookie 默认true */
  withCredentials?: boolean
  /** 调试模式 */
  debug?: boolean
  /** 平台类型 */
  source?: string
  /** 适配jxtokexxxn */
  api?: string
  /** 是否拦截重复请求 */
  openPreventRequest?: boolean
}
export interface CustomAxiosRequestHeaders extends AxiosRequestHeaders {
  'Content-Type': string
  /** token鉴权 */
  Authorization: string
  /** 用户id */
  userId: number
  /** 模式 */
  mode: string
  /** 版本号 */
  versionCode: number
}
/**
 * 接口请求结果
 *
 * @export
 * @interface FetchResult
 * @template T
 */
export interface FetchResult<T = any> {
  code: number
  current: number
  data: T
  extraData: T
  msg: string
  message?: string
}
