import React, { ReactNode } from "react";
import { Empty as NutEmpty } from "@nutui/nutui-react-taro";
import emptyImage from "./empty.png";
import "./index.scss";

interface EmptyProps {
  /** 自定义图片，默认使用内置图片 */
  image?: string;
  /** 图片大小 */
  imageSize?: number | string;
  /** 描述文字 */
  description?: string;
  /** 底部操作区域 */
  children?: ReactNode;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: React.CSSProperties;
}

const Empty: React.FC<EmptyProps> = ({
  image = emptyImage,
  imageSize = 240,
  description = "暂无数据",
  children,
  className = "",
  style,
}) => {
  return (
    <NutEmpty
      image={image}
      imageSize={imageSize}
      description={description}
      className={className}
      style={style}
    >
      {children}
    </NutEmpty>
  );
};

export default Empty;
