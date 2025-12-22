import BaseStore from "@/stores/Base";

export interface UserInfo {
  name: string;
  isAgree: boolean;
  isLogin: boolean;
}
export default class UserStore extends BaseStore {
  name = "";
  isAgree = false;
  isLogin = false;

  constructor() {
    super();

    this._init();
  }

  setUserInfo = (userInfo: UserInfo) => {
    this.name = userInfo.name;
    this.isAgree = userInfo.isAgree;
    this.isLogin = userInfo.isLogin;
  };

  setName(name: string) {
    this.name = name;
  }

  setIsAgree(isAgree: boolean) {
    this.isAgree = isAgree;
  }

  setIsLogin(isLogin: boolean) {
    this.isLogin = isLogin;
  }
}
