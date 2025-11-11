import { View, Text } from "@tarojs/components";
import { Loading } from "@nutui/nutui-react-taro";
import "./index.scss";

interface CustomLoadingProps {
  /** 是否显示加载中 */
  visible?: boolean;
  /** 加载文案 */
  text?: string;
  /** 尺寸大小 */
  size?: "small" | "base" | "large";
  /** 加载图标类型 */
  type?: "circular" | "spinner";
  /** 是否全屏显示 */
  overlay?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 垂直方向 */
  direction?: "horizontal" | "vertical";
}

const CustomLoading: React.FC<CustomLoadingProps> = ({
  visible = true,
  text = "加载中...",
  size = "base",
  type = "circular",
  overlay = false,
  className = "",
  direction = "vertical",
}) => {
  if (!visible) return null;

  const loadingContent = (
    <View
      className={`custom-loading ${direction === "vertical" ? "vertical" : "horizontal"} ${className}`}
    >
      <Loading
        type={type}
        className={`loading-icon ${size}`}
      />
      {text && (
        <Text className={`loading-text ${size}`}>
          {text}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View className="loading-overlay">
        <View className="loading-backdrop" />
        {loadingContent}
      </View>
    );
  }

  return loadingContent;
};

export default CustomLoading;
