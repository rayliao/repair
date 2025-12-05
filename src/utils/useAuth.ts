import { useEffect } from "react";
import Taro from "@tarojs/taro";
import { useUserStore } from "../store/userStore";

/**
 * 登录鉴权 Hook
 * 用于需要登录才能访问的页面
 * 如果未登录，自动跳转到登录页
 */
export const useAuth = () => {
  const { isLogin, userInfo, token } = useUserStore();

  useEffect(() => {
    if (!isLogin) {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000,
      });

      // 延迟跳转，让用户看到提示
      setTimeout(() => {
        Taro.navigateTo({
          url: "/pages/login/index",
        });
      }, 1000);
    }
  }, [isLogin]);

  return {
    isLogin,
    userInfo,
    token,
  };
};
