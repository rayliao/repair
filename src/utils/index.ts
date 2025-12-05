import Taro from "@tarojs/taro";
import { storage, host } from "./config";
// 导出登录鉴权 Hook
export { useAuth } from "./useAuth";

/**
 * 字符串裁切
 */
export const cutStr = (target, len = 10) => {
  if (typeof target === "string") {
    return target.length > len ? `${target.substr(0, len)}...` : target;
  }
  return target;
};

/**
 * 接口请求
 */
export const request = (options: any, cb: Function) => {
  const user = Taro.getStorageSync(storage.user);
  Taro.request({
    success: (res: any) => {
      if (res.statusCode === 200) {
        if (res.data.code !== 0) {
          if (res.data.code === 401) {
            Taro.removeStorageSync(storage.user);
            toLogin();
          } else {
            Taro.showToast({
              title: res.data.message,
            });
          }
        }
        cb(res.data);
      }
    },
    header: {
      "content-type": "application/json",
      "X-Access-Token": user ? user.token : "",
    },
    mode: "cors",
    ...options,
    url: `${host}${options.url}`,
  });
};

/**
 * 检查登录
 */
export const checkLogin = (cb) => {
  const user = Taro.getStorageSync(storage.user);
  if (!user) {
    toLogin();
  } else {
    cb();
  }
};


/**
 * 授权提示
 */
export const toLogin = () => {
  Taro.showModal({
    title: "提示",
    content: "尚未授权，请前往登录授权",
    success: function (res) {
      if (res.confirm) {
        Taro.switchTab({
          url: "../user/index",
        });
      }
    },
  });
};


/**
 * 设置业务员id
 * @param sid
 */
export const setSalerId = (sid) => {
  const salerId = Taro.getStorageSync(storage.salerId);
  if (!salerId && parseInt(sid, 10) !== 0) {
    Taro.setStorageSync(storage.salerId, sid);
  }
};


export const base64ToSrc = (data: string) => {
  const FILE_BASE_NAME = "tmp_base64src";
  const fsm = Taro.getFileSystemManager();
  return new Promise((resolve, reject) => {
    const [, format, bodyData] =
      /data:image\/(\w+);base64,(.*)/.exec(data) || [];
    if (!format) {
      reject(new Error("ERROR_BASE64SRC_PARSE"));
    }
    const filePath = `${Taro.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
    const buffer = Taro.base64ToArrayBuffer(bodyData);
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: "binary",
      success() {
        resolve(filePath);
      },
      fail() {
        reject(new Error("ERROR_BASE64SRC_WRITE"));
      },
    });
  });
};
