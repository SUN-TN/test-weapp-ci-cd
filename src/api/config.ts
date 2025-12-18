import type { RequestConfig } from './types';

export const defaultConfig: RequestConfig = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  baseURL: BASE_URL ?? '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false,
  showLoading: false, // 默认不显示loading
  showError: true, // 默认显示错误提示
};

export const getDefaultConfig = (): RequestConfig => {
  return defaultConfig;
};
