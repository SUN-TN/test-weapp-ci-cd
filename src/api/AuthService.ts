import BaseService from "./BaseService";

export interface TokenInfo {
  token: string;
  expires: number;
  refreshToken: string;
  expiresRefreshToken: number;
}
export default class AuthService extends BaseService {
  constructor() {
    super();
  }

  login(code: string) {
    // TODO: 登录
    return this.request.post<TokenInfo>("/auth/login", {
      code,
    });
  }

  refreshToken(refreshToken: string) {
    // TODO: 刷新 token
    return this.request.post<TokenInfo>("/auth/refresh-token", {
      refreshToken,
    });
  }
}
