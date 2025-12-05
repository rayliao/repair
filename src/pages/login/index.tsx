import { View, Image } from "@tarojs/components";
import { Button, Checkbox } from "@nutui/nutui-react-taro";
import { useState } from "react";
import Taro from "@tarojs/taro";
import { useUserStore } from "../../store/userStore";
import { getUserOpenIdJsCode, usePostGzhPhone } from "../../api/gzh/gzh";
import { usePostUserLogin } from "../../api/user/user";
import "./index.scss";

const Login = () => {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setLogin } = useUserStore();

  // 解密手机号接口
  const { trigger: decryptPhone } = usePostGzhPhone();
  // 登录接口
  const { trigger: loginUser } = usePostUserLogin();

  // 处理手机号授权
  const handleGetPhoneNumber = async (e: any) => {
    console.log("手机号授权回调:", e);

    // 检查是否同意协议
    if (!agreed) {
      Taro.showToast({
        title: "请先阅读并同意用户协议",
        icon: "none",
      });
      return;
    }

    // 用户拒绝授权
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      Taro.showToast({
        title: "已取消授权",
        icon: "none",
      });
      return;
    }

    setLoading(true);

    try {
      const { code, encryptedData, iv } = e.detail;

      // 第一步：获取微信登录 code 换取 openID 和 session_key
      const wxLoginRes = await Taro.login();
      console.log("微信登录结果:", wxLoginRes);
      if (!wxLoginRes.code) {
        throw new Error("获取微信登录code失败");
      }

      // 第二步：通过 js_code 获取 openID 和 session_key
      const openIdRes = await getUserOpenIdJsCode({ js_code: wxLoginRes.code });

      if (openIdRes?.code !== 0 || !openIdRes.data) {
        throw new Error(openIdRes?.message || "获取OpenID失败");
      }

      const { openId, session_Key } = openIdRes.data;

      // 第三步：解密手机号
      const phoneRes = await decryptPhone({
        openID: openId,
        encryptedData,
        iv,
        session_key: session_Key,
      });

      if (phoneRes?.code !== 0 || !phoneRes.data) {
        throw new Error(phoneRes?.message || "解密手机号失败");
      }

      const phone = phoneRes.data;

      // 第四步：使用手机号和 openID 登录/注册
      const loginRes = await loginUser({
        openID: openId,
        phone: phone,
        nickName: null,
        headImg: null,
      });

      if (loginRes?.code !== 0 || !loginRes.data) {
        throw new Error(loginRes?.message || "登录失败");
      }

      const userInfo = loginRes.data;

      // 第五步：保存登录状态
      setLogin(openId || "", {
        id: userInfo.id,
        nickname: userInfo.nickName || "用户",
        phone: userInfo.phone || "",
        avatar: userInfo.headImage || "",
      });

      Taro.showToast({
        title: "登录成功",
        icon: "success",
      });

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        Taro.switchTab({
          url: "/pages/profile/index",
        });
      }, 1500);
    } catch (error: any) {
      console.error("登录失败:", error);
      Taro.showToast({
        title: error.message || "登录失败，请重试",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAgreementClick = (type: "user" | "privacy") => {
    console.log("查看协议:", type);
    // TODO: 跳转到协议页面
    Taro.showToast({
      title: type === "user" ? "用户协议" : "隐私政策",
      icon: "none",
    });
  };

  return (
    <View className="login-page">
      <View className="login-container">
        {/* Logo 区域 */}
        <View className="logo-section">
          <View className="logo-wrapper">
            <Image
              src="https://via.placeholder.com/100/d81e06/ffffff?text=LOGO"
              className="logo"
              mode="aspectFit"
            />
          </View>
          <View className="app-name">关师傅维修</View>
          <View className="app-slogan">专业维修，值得信赖</View>
        </View>

        {/* 登录表单区域 */}
        <View className="login-form">
          {/* 协议复选框 */}
          <View className="agreement-section">
            <Checkbox
              checked={agreed}
              onChange={(checked) => setAgreed(checked)}
            >
              <View className="agreement-text">
                <View className="text-wrapper">
                  我已阅读并同意
                  <View
                    className="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgreementClick("user");
                    }}
                  >
                    《用户协议》
                  </View>
                  和
                  <View
                    className="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgreementClick("privacy");
                    }}
                  >
                    《隐私政策》
                  </View>
                </View>
              </View>
            </Checkbox>
          </View>

          {/* 登录按钮 */}
          <Button
            block
            type="primary"
            size="large"
            className="login-btn"
            openType="getPhoneNumber"
            onGetPhoneNumber={handleGetPhoneNumber}
            loading={loading}
          >
            <View className="btn-text">手机号快捷登录</View>
          </Button>

          <View className="login-tips">登录即表示您已同意相关协议</View>
        </View>
      </View>
    </View>
  );
};

export default Login;
