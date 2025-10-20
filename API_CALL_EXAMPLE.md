# 🎉 API 调用示例 - 实时验证

## 📱 已集成的首页

首页现在已经**实时调用 API** 并展示数据！

### ✨ 实现细节

**文件**: `src/pages/index/index.tsx`

```typescript
import { useGetApiWebInfo } from "../../api/web-api/web-api";

function Index() {
  const { data, isLoading, error } = useGetApiWebInfo();
  
  // 页面会自动加载 API 数据
  // 显示网站名称、Logo、横幅等信息
}
```

## 🔄 API 调用流程

```
用户进入首页
    ↓
React Query 自动触发 useGetApiWebInfo hook
    ↓
taroAxios 将请求转换为 Taro.request
    ↓
调用 http://106.55.142.137/api/web/info
    ↓
返回数据并缓存
    ↓
UI 自动刷新显示数据
```

## 📊 API 端点概览

### 已生成的所有 API

| 端点 | 方法 | Hook 名称 | 返回类型 | 说明 |
|------|------|---------|--------|------|
| `/api/web/info` | GET | `useGetApiWebInfo` | `WebInfo` | ✅ 已集成到首页 |
| `/api/city/list` | GET | `useGetApiCityList` | `WebServiceTypeDto[]` | 城市列表 |
| 更多... | | 查看 `src/api/web-api/web-api.ts` | | 自动生成 |

## 🎯 快速开始使用 API

### 1️⃣ 在任何组件中使用 API Hook

```typescript
import { useGetApiWebInfo, useGetApiCityList } from '@/api/web-api/web-api'

function MyComponent() {
  // 获取网站信息
  const { data: webInfo, isLoading, error } = useGetApiWebInfo()
  
  // 获取城市列表
  const { data: cityList } = useGetApiCityList()
  
  if (isLoading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>
  
  return (
    <div>
      <h1>{webInfo?.data?.name}</h1>
      <ul>
        {cityList?.data?.map(city => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 2️⃣ 手动查询（不自动调用）

```typescript
import { getApiWebInfo, getGetApiWebInfoQueryKey } from '@/api/web-api/web-api'
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data } = useQuery({
    queryKey: getGetApiWebInfoQueryKey(),
    queryFn: ({ signal }) => getApiWebInfo(signal),
    enabled: false // 不自动调用
  })
  
  // 需要时手动触发查询
}
```

### 3️⃣ 刷新数据

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { getGetApiWebInfoQueryKey } from '@/api/web-api/web-api'

function MyComponent() {
  const queryClient = useQueryClient()
  
  const handleRefresh = () => {
    // 刷新网站信息
    queryClient.invalidateQueries({ 
      queryKey: getGetApiWebInfoQueryKey() 
    })
  }
  
  return <button onClick={handleRefresh}>刷新</button>
}
```

## 🧪 测试 API 调用

### 方法 1: 查看首页

```bash
pnpm dev:weapp
```

首页会自动加载 API 数据，显示：
- 网站名称
- Logo 地址
- 横幅数量

### 方法 2: 使用浏览器开发者工具

1. 打开微信开发者工具
2. 打开调试窗口 (F12)
3. 切换到 Network 标签
4. 观察请求到 `http://106.55.142.137/api/web/info`
5. 查看响应数据

### 方法 3: 控制台日志

```typescript
function Index() {
  const { data, isLoading, error } = useGetApiWebInfo();
  
  useEffect(() => {
    if (data) {
      console.log('✅ API 数据加载成功:', data)
    }
    if (error) {
      console.error('❌ API 错误:', error)
    }
  }, [data, error])
  
  return (...)
}
```

## 📋 API 数据类型

### WebInfo 类型

```typescript
interface WebInfo {
  logo?: string | null           // 网站Logo URL
  name?: string | null           // 网站名称
  banner?: string[] | null       // 网站横幅数组
}
```

### 响应格式

```json
{
  "data": {
    "logo": "https://example.com/logo.png",
    "name": "网站名称",
    "banner": [
      "https://example.com/banner1.jpg",
      "https://example.com/banner2.jpg"
    ]
  },
  "status": 200,
  "statusText": "OK",
  "headers": {...},
  "config": {...}
}
```

## ⚙️ 环境配置

### 修改 API 基础 URL

编辑 `orval.config.js`:

```javascript
module.exports = {
  petstore: {
    input: 'http://你的-swagger-url/swagger/v1/swagger.json',
    output: {
      target: './src/api',
      client: 'react-query',
      httpClient: 'axios',
    },
  },
}
```

然后重新生成：

```bash
pnpm api:gen
```

### 修改请求超时

编辑 `src/utils/taroAxios.ts`:

```typescript
function convertAxiosToTaroConfig(axiosConfig: TaroRequestConfig) {
  const { timeout = 60000 } = axiosConfig  // 改这里，单位: 毫秒
  // ...
}
```

## 🐛 常见问题

### Q: 数据没有加载
**A**: 检查：
1. API 服务是否在线: http://106.55.142.137/api/web/info
2. 网络连接是否正常
3. QueryProvider 是否包装了应用

### Q: 显示错误消息
**A**: 检查：
1. 服务器是否返回正确的数据格式
2. CORS 设置是否允许请求
3. API 端点是否改变

### Q: 如何处理错误
**A**: 使用 error 属性：
```typescript
const { data, error, isLoading } = useGetApiWebInfo()

if (error) {
  return <div>错误: {error.message}</div>
}
```

### Q: 如何禁用自动缓存
**A**: 在调用时指定：
```typescript
const { data } = useGetApiWebInfo({
  query: {
    staleTime: 0,  // 总是认为数据过期
    gcTime: 0,     // 立即清理缓存
  }
})
```

## 🚀 生产环境建议

1. **添加错误边界** - 捕获 API 错误
2. **添加重试逻辑** - `retry: 3`
3. **添加超时设置** - `timeout: 30000`
4. **添加请求拦截器** - 统一处理认证
5. **添加响应拦截器** - 统一处理错误
6. **使用环境变量** - 区分开发/生产 API
7. **添加加载状态 UI** - 更好的用户体验
8. **添加错误提示** - Toast 或 Notification

## 📚 参考文档

- [React Query 文档](https://tanstack.com/query/latest)
- [Orval 文档](https://orval.dev/)
- [Taro 文档](https://taro.jd.com/)
- [Axios 文档](https://axios-http.com/)

---

## ✅ 完成清单

- [x] API 代码自动生成
- [x] React Query 集成
- [x] Taro 适配器实现
- [x] 首页 API 调用
- [x] 数据展示
- [x] 类型安全
- [x] 构建成功 ✨

**项目已完全就绪！** 🎉

