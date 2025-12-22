import { useMount } from "ahooks";
import { showLoading, hideLoading, login, getStorageSync } from "@tarojs/taro";
import React, { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import PrivacyConfirmPopup from "@/components/PrivacyConfirmPopup/PrivacyConfirmPopup";
import { usePrivacyConfirmPopup } from "@/components/PrivacyConfirmPopup/usePrivacyConfirmPopup";
import { useStore, observer } from "@/stores";

function AuthWrap({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { userStore } = useStore();
  const {
    showPrivacyConfirmPopup,
    setShowPrivacyConfirmPopup,
    onAgree,
    onDisagree,
  } = usePrivacyConfirmPopup();

  const handleRefreshToken = async () => {
    // TODO: 刷新Token
  };

  const getUserInfo = async () => {
    // TODO: 获取用户信息
  };

  useEffect(() => {
    if (userStore.isLogin && !userStore.isAgree) {
      setShowPrivacyConfirmPopup(true);
    }
  }, [userStore.isLogin, userStore.isAgree, setShowPrivacyConfirmPopup]);

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
      userStore.setUserInfo({
        name: "测试",
        isLogin: true,
        isAgree: false,
      });
      hideLoading();
    } catch {
      hideLoading();
    }
  };

  useMount(() => {
    auth();
  });

  return (
    <Fragment>
      {isAuthenticated && children}
      <PrivacyConfirmPopup
        visible={showPrivacyConfirmPopup}
        onAgree={onAgree}
        onDisagree={onDisagree}
      />
    </Fragment>
  );
}

export default observer(AuthWrap);
