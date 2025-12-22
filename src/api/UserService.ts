import BaseService from "./BaseService";

export interface User {
  name: string;
  isAgree: boolean;
  age: number;
  sex: "男" | "女";
  phone: string;
  birth: string;
}
export default class UserService extends BaseService {
  constructor() {
    super();
  }

  getUserInfo() {
    // TODO: 获取用户信息
    return this.request.get<User>("/users");
  }
}
