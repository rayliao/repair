import Taro from "@tarojs/taro";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserInfo {
  id?: number;
  nickname?: string;
  phone?: string;
  avatar?: string;
}

interface UserState {
  isLogin: boolean;
  userInfo: UserInfo | null;
  token: string | null;
  setLogin: (token: string, userInfo: UserInfo) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLogin: false,
      userInfo: null,
      token: null,
      setLogin: (token, userInfo) =>
        set({
          isLogin: true,
          token,
          userInfo,
        }),
      setUserInfo: (userInfo) =>
        set((state) => ({
          userInfo: { ...state.userInfo, ...userInfo },
        })),
      logout: () =>
        set({
          isLogin: false,
          token: null,
          userInfo: null,
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = Taro.getStorageSync(name);
          return value || null;
        },
        setItem: (name, value) => {
          Taro.setStorageSync(name, value);
        },
        removeItem: (name) => {
          Taro.removeStorageSync(name);
        },
      })),
    }
  )
);
