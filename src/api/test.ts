export interface Page<T> {
  records: Array<T>;
  total: number;
}
// 请求参数
export interface HotArticleQuery {
  pageSize: number;
  pageIndex: number;
  searchKey: string;
}
// 返回分页数据的具体参数
export interface HotArticleVo {
  id: number;
  title: string;
}

import http from "./http";

const headers = {
  "Content-Type": "applicati/x-www-form-urlencoded",
};

// 声明文件放在 types/api/同名.d.ts
class TestApi {
  static getArticle = (params: HotArticleQuery) =>
    http<any>("api/hello", "GET", params);
}

export { TestApi };
