import { useMount } from "ahooks";
import { showLoading, hideLoading, login, getStorageSync } from "@tarojs/taro";
import React, { useState } from "react";
import dayjs from "dayjs";

export default function AuthWrap({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleRefreshToken = async () => {
    // TODO: 刷新Token
  };

  const auth = async () => {
    showLoading({ title: "加载中" });
    const {
      token,
      refreshToken,
      tokenExpirationTime,
      refreshTokenExpirationTime,
    } = getStorageSync("tokenInfo") || {};

    // 存在token且未过期
    if (
      token &&
      tokenExpirationTime &&
      dayjs().isAfter(tokenExpirationTime, "second")
    ) {
      console.debug("token未过期");
      setIsAuthenticated(true);
      return;
    }

    // 存在refreshToken且未过期
    if (
      refreshToken &&
      refreshTokenExpirationTime &&
      dayjs().isAfter(refreshTokenExpirationTime, "second")
    ) {
      console.debug("refreshToken未过期");
      handleRefreshToken();
      return;
    }

    // 重新登录
    try {
      const { code } = await login();
      // TODO: 登录
      console.debug("登录", code);
      setIsAuthenticated(true);
      hideLoading();
    } catch {
      hideLoading();
    }
  };

  useMount(() => {
    auth();
  });
  return isAuthenticated ? children : "";
}
