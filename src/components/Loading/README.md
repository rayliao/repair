# CustomLoading 自定义加载组件

基于 NutUI Loading 组件封装的自定义加载组件，提供更丰富的功能和更好的使用体验。

## 功能特点

- ✅ 基于 NutUI Loading 组件
- ✅ 支持多种尺寸（small、base、large）
- ✅ 支持两种加载图标类型（circular、spinner）
- ✅ 支持水平和垂直布局方向
- ✅ 支持全屏遮罩模式
- ✅ 自定义加载文案
- ✅ 响应式设计

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | boolean | true | 是否显示加载中 |
| text | string | "加载中..." | 加载文案 |
| size | "small" \| "base" \| "large" | "base" | 尺寸大小 |
| type | "circular" \| "spinner" | "circular" | 加载图标类型 |
| overlay | boolean | false | 是否全屏显示 |
| className | string | "" | 自定义样式类名 |
| direction | "horizontal" \| "vertical" | "vertical" | 垂直或水平方向 |

## 使用示例

### 基础用法
```tsx
import CustomLoading from "../../components/Loading";

// 基础加载
<CustomLoading text="加载中..." />

// 不显示文字
<CustomLoading text="" />

// 水平布局
<CustomLoading text="请稍候..." direction="horizontal" />
```

### 不同尺寸
```tsx
// 小尺寸
<CustomLoading size="small" text="加载中..." />

// 中等尺寸（默认）
<CustomLoading size="base" text="加载中..." />

// 大尺寸
<CustomLoading size="large" text="加载中..." />
```

### 不同类型
```tsx
// 圆形加载器（默认）
<CustomLoading type="circular" />

// 旋转器
<CustomLoading type="spinner" />
```

### 全屏遮罩
```tsx
// 全屏遮罩模式
<CustomLoading 
  overlay={true} 
  text="数据加载中..." 
  visible={isLoading}
/>
```

### 条件显示
```tsx
// 根据状态控制显示
<CustomLoading 
  visible={isLoading} 
  text="正在提交..." 
/>
```

### 自定义样式
```tsx
// 添加自定义样式
<CustomLoading 
  className="my-loading" 
  text="自定义加载..." 
/>
```

## 样式定制

组件使用 CSS Module，可以通过以下方式自定义样式：

```scss
// 自定义加载文字颜色
:global(.my-loading) {
  .loading-text {
    color: #d81e06;
    font-weight: bold;
  }
}

// 自定义遮罩背景
:global(.custom-overlay) {
  .loading-backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
  
  .custom-loading {
    background: rgba(255, 255, 255, 0.95);
  }
}
```
