export type PromiseWithResolvers<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

// 声明 defineConstants 中定义的所有常量
declare global {
  /** 基础 URL */
  const FILE_BASE_URL: string;
  /** 基础 URL */
  const BASE_URL: string;

  interface PromiseConstructor {
    withResolvers<T>(): PromiseWithResolvers<T>;
  }
}

// 必须添加这行，将文件标记为模块，否则 declare global 可能不生效
export {};
