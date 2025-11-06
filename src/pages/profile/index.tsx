import { View, Image } from "@tarojs/components";
import {
  Button,
  Cell,
} from "@nutui/nutui-react-taro";
import {
  Heart,
  Comment,
  Location,
  Feedback,
  Setting,
  Phone,
  ArrowRight,
} from "@nutui/icons-react-taro";
import { useState } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

const Profile = () => {
  const [isLogin] = useState(true); // TODO: 从状态管理或 API 获取登录状态

  // 菜单项配置
  const menuItems: MenuItem[] = [
    { id: "collections", title: "我的收藏", icon: <Heart size={20} />, color: "#FF6B6B" },
    { id: "comments", title: "我的评论", icon: <Comment size={20} />, color: "#4ECDC4" },
    { id: "addresses", title: "地址管理", icon: <Location size={20} />, color: "#45B7D1" },
    { id: "feedback", title: "意见反馈", icon: <Feedback size={20} />, color: "#FFA502" },
    { id: "settings", title: "设置中心", icon: <Setting size={20} />, color: "#8B5CF6" },
    { id: "service", title: "联系客服", icon: <Phone size={20} />, color: "#FF8A65" },
  ];

  const handleMenuClick = (menuId: string) => {
    console.log("点击菜单:", menuId);

    switch (menuId) {
      case "addresses":
        // 跳转到地址管理页面
        Taro.navigateTo({
          url: "/pages/address-list/index"
        });
        break;
      case "collections":
        // TODO: 跳转到我的收藏页面
        Taro.showToast({
          title: "我的收藏功能开发中",
          icon: "none",
        });
        break;
      case "comments":
        // TODO: 跳转到我的评论页面
        Taro.showToast({
          title: "我的评论功能开发中",
          icon: "none",
        });
        break;
      case "feedback":
        // TODO: 跳转到意见反馈页面
        Taro.showToast({
          title: "意见反馈功能开发中",
          icon: "none",
        });
        break;
      case "settings":
        // TODO: 跳转到设置中心页面
        Taro.showToast({
          title: "设置中心功能开发中",
          icon: "none",
        });
        break;
      case "service":
        // TODO: 联系客服功能
        Taro.showToast({
          title: "联系客服功能开发中",
          icon: "none",
        });
        break;
      default:
        break;
    }
  };

  const handleBecomeMaster = () => {
    console.log("成为师傅");
    // TODO: 跳转到成为师傅页面
  };

  const handleLogin = () => {
    console.log("跳转到登录");
    // TODO: 跳转到登录页面
  };

  return (
    <View className="profile-page">
      {/* 用户信息头部 */}
      <View className="profile-header">
        {isLogin ? (
          <View className="user-info">
            <View className="user-left">
              <Image
                src="https://via.placeholder.com/60/d81e06/ffffff?text=用户"
                className="user-avatar"
                mode="scaleToFill"
              />
              <View className="user-details">
                <View className="user-name">用户昵称</View>
                <View className="user-phone">18888888888</View>
              </View>
            </View>
            <View className="user-right">
              <Button
                type="primary"
                size="small"
                className="become-master-btn"
                onClick={handleBecomeMaster}
              >
                成为师傅
              </Button>
            </View>
          </View>
        ) : (
          <View className="login-prompt">
            <View className="prompt-text">登录后享受更多功能</View>
            <Button
              type="primary"
              size="small"
              className="login-btn"
              onClick={handleLogin}
            >
              立即登录
            </Button>
          </View>
        )}
      </View>

      {/* 菜单功能区域 */}
      <View className="menu-section">
        {menuItems.map((item) => (
          <Cell
            key={item.id}
            title={item.title}
            className="cell-item"
            onClick={() => handleMenuClick(item.id)}
          >
            <View className="cell-left">
              <View className="cell-icon" style={{ color: item.color }}>
                {item.icon}
              </View>
              <View className="cell-title">{item.title}</View>
            </View>
            <View className="cell-right">
              <ArrowRight size={16} color="#999" />
            </View>
          </Cell>
        ))}
      </View>

      {/* 退出登录按钮 */}
      {isLogin && (
        <View className="logout-section">
          <Button
            block
            size="large"
            type="danger"
            onClick={() => console.log("退出登录")}
          >
            退出登录
          </Button>
        </View>
      )}
    </View>
  );
};

export default Profile;
