import { View, Text } from "@tarojs/components";
import { Button, Loading } from "@nutui/nutui-react-taro";
import { useEffect } from "react";
import { useGetApiWebInfo } from "../../api/web-api/web-api";
import { getApiWebInfo } from "../../api/web-api/web-api";

import "./index.scss";

// 使用 hooks 的函数组件
function Index() {
  console.log('📄 首页组件渲染中...');

  const { data, isLoading, error } = useGetApiWebInfo();

  // 调试日志
  useEffect(() => {
    console.log("🚀 首页组件已挂载，hook 已调用");
    console.log("📊 数据:", data);
    console.log("⏳ 加载中:", isLoading);
    console.log("❌ 错误:", error);
  }, [data, isLoading, error]);

  // 测试直接调用 API 函数
  useEffect(() => {
    console.log('🧪 测试直接调用 getApiWebInfo...');
    getApiWebInfo()
      .then(res => {
        console.log('✅ 直接调用成功:', res);
      })
      .catch(err => {
        console.error('❌ 直接调用失败:', err);
      });
  }, []);
  if (isLoading) {
    return (
      <View className="index">
        <View className="index-header">
          <Text className="index-title">首页</Text>
        </View>
        <View
          className="index-content"
          style={{ textAlign: "center", paddingTop: "40px" }}
        >
          <Loading />
          <Text style={{ marginTop: "10px" }}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="index">
        <View className="index-header">
          <Text className="index-title">首页</Text>
        </View>
        <View
          className="index-content"
          style={{ textAlign: "center", paddingTop: "40px" }}
        >
          <Text style={{ color: "#f56c6c" }}>加载失败: {String(error)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="index">
      <View className="index-header">
        <Text className="index-title">首页</Text>
      </View>

      <View className="index-content">
        {/* API 数据展示 */}
        {data && (
          <View
            className="api-data-section"
            style={{
              background: "#f0f9ff",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              borderLeft: "4px solid #409eff",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                marginBottom: "10px",
                display: "block",
              }}
            >
              📡 API 返回数据
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "5px",
                display: "block",
              }}
            >
              网站名称: {(data as any)?.name || "(暂无)"}
            </Text>
            {(data as any)?.logo && (
              <Text
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "5px",
                  display: "block",
                }}
              >
                Logo: {(data as any)?.logo}
              </Text>
            )}
            {(data as any)?.banner && (data as any)?.banner.length > 0 && (
              <Text
                style={{ fontSize: "12px", color: "#666", display: "block" }}
              >
                横幅数量: {(data as any)?.banner.length}
              </Text>
            )}
          </View>
        )}

        <View className="welcome-section">
          <Text className="welcome-text">欢迎使用维修服务平台</Text>
          <Text className="description">
            已集成 Orval + React Query + Taro.request
          </Text>
        </View>

        <View className="feature-list">
          <View className="feature-item">
            <Text className="feature-title">🚀 快速生成</Text>
            <Text className="feature-desc">
              从 Swagger 文档自动生成 API 代码
            </Text>
          </View>

          <View className="feature-item">
            <Text className="feature-title">⚡ 类型安全</Text>
            <Text className="feature-desc">完整的 TypeScript 类型支持</Text>
          </View>

          <View className="feature-item">
            <Text className="feature-title">💾 自动缓存</Text>
            <Text className="feature-desc">React Query 自动管理数据缓存</Text>
          </View>

          <View className="feature-item">
            <Text className="feature-title">🔄 跨平台</Text>
            <Text className="feature-desc">Taro 框架支持多端编译</Text>
          </View>
        </View>

        <View className="action-section">
          <Button
            type="primary"
            size="large"
            onClick={() => {
              console.log("查看文档: ORVAL_GUIDE.md");
            }}
          >
            查看 API 集成指南
          </Button>

          <Button
            type="primary"
            fill="outline"
            size="large"
            onClick={() => {
              console.log("查看示例: API_USAGE_GUIDE.md");
            }}
          >
            查看使用示例
          </Button>
        </View>

        <View className="tips-section">
          <Text className="tips-title">快速开始</Text>
          <View className="tip-item">
            <Text className="tip-number">1</Text>
            <Text className="tip-text">运行 pnpm api:gen 生成 API 代码</Text>
          </View>
          <View className="tip-item">
            <Text className="tip-number">2</Text>
            <Text className="tip-text">在 app.ts 中添加 QueryProvider</Text>
          </View>
          <View className="tip-item">
            <Text className="tip-number">3</Text>
            <Text className="tip-text">在组件中使用生成的 hooks</Text>
          </View>
          <View className="tip-item">
            <Text className="tip-number">4</Text>
            <Text className="tip-text">享受类型安全和自动缓存管理</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Index;
