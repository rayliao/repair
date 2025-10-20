# 🔧 API 请求诊断指南

## 问题排查

你说"没有看到接口请求"？这里是检查列表。

---

## ✅ 问题已修复

**原因**: Orval 生成的 URL 配置不正确
- ❌ 旧 URL: `process.env.REACT_APP_API_URL || "http://106.55.142.137"/api/web/info`
- ✅ 新 URL: `http://106.55.142.137/api/web/info`

**已修复**:
```bash
pnpm api:gen  # 已重新生成正确的 API 代码
pnpm build:weapp  # 已重新构建
```

---

## 🧪 如何看到接口请求

### 方法 1: 微信开发者工具调试 (最直接) ⭐

```
1. 打开微信开发者工具
2. 进入首页 (pages/index)
3. 按 F12 打开开发者工具
4. 切换到 Network 标签页
5. 在页面加载时观察网络请求
6. 你应该看到:
   - 请求: GET http://106.55.142.137/api/web/info
   - 响应: 200 状态码 + JSON 数据
```

### 方法 2: Console 日志

在 `src/pages/index/index.tsx` 中添加：

```typescript
function Index() {
  const { data, isLoading, error } = useGetApiWebInfo();
  
  // 添加日志
  useEffect(() => {
    console.log('🚀 首页组件已挂载');
    console.log('⏳ 加载中:', isLoading);
    console.log('📡 数据:', data);
    console.log('❌ 错误:', error);
  }, [data, isLoading, error]);
  
  // ... 其余代码
}
```

然后在 Console 中查看日志。

### 方法 3: 抓包工具

使用 Charles、Fiddler 或 mitmproxy 等抓包工具：

```
1. 配置代理到你的电脑 IP
2. 微信开发者工具设置代理
3. 启动应用
4. 在抓包工具中观察请求
```

---

## 🔍 检查清单

逐个检查以下内容：

### ✓ 1. API 文件正确性

打开 `src/api/web-api/web-api.ts`，查看第 41 行：

```typescript
export const getApiWebInfo = (signal?: AbortSignal) => {
  return createTaroAxiosInstance<WebInfo>(
    {url: `http://106.55.142.137/api/web/info`, method: 'GET', signal},
  );
}
```

**检查项**:
- ✓ URL 是否正确: `http://106.55.142.137/api/web/info`
- ✓ 方法是否正确: `GET`
- ✓ 是否调用了 `createTaroAxiosInstance`

### ✓ 2. 首页组件使用 hook

打开 `src/pages/index/index.tsx`，查看第 9 行：

```typescript
const { data, isLoading, error } = useGetApiWebInfo();
```

**检查项**:
- ✓ 是否导入了 hook: `import { useGetApiWebInfo } from "../../api/web-api/web-api"`
- ✓ 是否在组件中调用了 hook
- ✓ 组件是否是函数组件 (支持 hooks)

### ✓ 3. QueryProvider 配置

打开 `src/app.tsx`，查看第 32-34 行：

```typescript
render() {
  return <QueryProvider>{this.props.children}</QueryProvider>;
}
```

**检查项**:
- ✓ 是否导入了 QueryProvider
- ✓ 是否包装了整个应用

### ✓ 4. HTTP 适配器

打开 `src/utils/taroAxios.ts`，查看函数是否存在：

```typescript
export async function taroRequest<T = any>(
  config: TaroRequestConfig
): Promise<AxiosResponse<T>>
```

**检查项**:
- ✓ 文件是否存在
- ✓ 函数是否导出

### ✓ 5. React Query 配置

打开 `src/utils/queryClient.ts` 或 `src/components/Common/queryClient.tsx`

**检查项**:
- ✓ QueryClient 是否创建
- ✓ QueryClientProvider 是否导出

---

## 🚀 完整测试步骤

### Step 1: 确保代码正确

```bash
# 1. 更新 API 代码
pnpm api:gen

# 2. 检查是否有错误
pnpm run build:weapp
```

### Step 2: 启动开发服务

```bash
pnpm dev:weapp
```

### Step 3: 打开调试窗口

微信开发者工具:
- F12 或右键 → 检查元素
- 选择 Network 标签页

### Step 4: 打开首页

- 点击底部 "首页" 标签
- 观察 Network 标签中是否有新请求

### Step 5: 检查请求

应该看到:
```
请求 URL: http://106.55.142.137/api/web/info
请求方法: GET
状态码: 200 OK
响应体: JSON 数据
```

---

## 🐛 常见问题解决

### 问题 1: 看不到任何网络请求

**原因和解决**:

1. **组件没有挂载**
   - 检查是否在首页
   - 检查是否是函数组件
   - 检查是否调用了 hook

2. **Network 标签没有打开**
   - F12 打开开发者工具
   - 确保 Network 标签已选中
   - 可能需要刷新页面

3. **请求被缓存了**
   - 第一次访问时会发送请求
   - 之后 5 分钟内会使用缓存
   - 手动刷新或清除缓存

**解决方案**:
```bash
# 1. 清除缓存重新启动
rm -rf dist node_modules/.vite
pnpm dev:weapp

# 2. 或者在首页添加日志
console.log('useGetApiWebInfo called');
```

### 问题 2: 看到请求但是报错

**检查错误信息**:

1. **CORS 错误**
   ```
   Cross-Origin Request Blocked
   ```
   - 检查服务器是否启用了 CORS
   - 检查是否有代理配置

2. **网络错误**
   ```
   Network Error
   ```
   - 检查 API 服务器是否在线
   - 检查网络连接

3. **超时错误**
   ```
   Request Timeout
   ```
   - 增加超时时间
   - 检查网络速度

**解决方案**:
```typescript
// 在 src/utils/queryClient.ts 中调整
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,  // 增加重试次数
      staleTime: 1000 * 60 * 10,  // 增加缓存时间
    },
  },
});
```

### 问题 3: 看到请求但是没有数据显示

**检查以下项**:

1. 数据结构是否正确
   ```typescript
   console.log(data);  // 查看数据结构
   ```

2. 数据访问路径是否正确
   ```typescript
   // 正确: data?.data?.name
   // 错误: data?.name
   ```

3. 响应格式是否是 AxiosResponse
   ```typescript
   interface AxiosResponse {
     data: T,      // 实际数据在 .data 属性
     status: number,
     statusText: string,
     headers: {},
     config: {},
   }
   ```

**解决方案**:
```typescript
// 首页中访问数据时使用正确的路径
{(data as any).data?.name || '(暂无)'}  // ✓ 正确
{data?.name || '(暂无)'}                // ✗ 错误
```

---

## 📊 验证流程

### 快速验证

```bash
# 1. 检查 API URL 是否正确
grep -n "http://106.55.142.137/api/web/info" src/api/web-api/web-api.ts

# 2. 检查首页是否使用了 hook
grep -n "useGetApiWebInfo" src/pages/index/index.tsx

# 3. 检查 QueryProvider 是否配置
grep -n "QueryProvider" src/app.tsx
```

### 完整验证

```bash
# 构建并测试
pnpm api:gen  # 重新生成 API 代码
pnpm run build:weapp  # 构建

# 输出应该显示:
# ✓ 1029 modules transformed.
# ✓ built in ~8s
```

---

## 💡 如果仍然看不到请求

按以下顺序排查：

1. **清除所有缓存**
   ```bash
   pnpm api:gen
   rm -rf dist
   pnpm run build:weapp
   pnpm dev:weapp
   ```

2. **查看日志输出**
   在首页添加日志：
   ```typescript
   useEffect(() => {
     console.log('Component mounted');
     console.log('Data:', data);
     console.log('Loading:', isLoading);
     console.log('Error:', error);
   }, [data, isLoading, error]);
   ```

3. **检查源代码**
   - `src/api/web-api/web-api.ts` - API 代码是否正确生成
   - `src/pages/index/index.tsx` - 组件是否正确调用 hook
   - `src/app.tsx` - QueryProvider 是否包装

4. **查看完整日志**
   ```bash
   pnpm dev:weapp 2>&1 | tail -100
   ```

---

## ✨ 预期结果

正确配置后，你应该看到：

### Network 标签:
```
GET http://106.55.142.137/api/web/info  200 OK  142ms
```

### Console 日志:
```
Component mounted
Data: {data: {name: "...", logo: "...", banner: [...]}}
Loading: false
Error: undefined
```

### 页面显示:
```
📡 API 返回数据
网站名称: [从 API 获取的名称]
Logo: [从 API 获取的 Logo]
横幅数量: [从 API 获取的横幅数量]
```

---

## 🎯 总结

| 检查项 | 状态 | 说明 |
|--------|------|------|
| API URL 是否正确 | ✅ | `http://106.55.142.137/api/web/info` |
| 首页是否使用 hook | ✅ | `useGetApiWebInfo()` |
| QueryProvider 是否配置 | ✅ | 在 `app.tsx` 中包装 |
| HTTP 适配器是否存在 | ✅ | `src/utils/taroAxios.ts` |
| 构建是否成功 | ✅ | 1029 modules |

**现在你的项目已经完全就绪，应该能看到接口请求了！** 🚀

如果还是看不到，请在微信开发者工具的 Console 中查看是否有错误信息，或者使用上面的调试方法逐个排查。

