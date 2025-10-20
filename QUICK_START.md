# 🚀 快速开始指南

## ⏱️ 5 分钟快速开始

### 1️⃣ 查看首页 API 调用 (30 秒)

```bash
# 启动开发服务
pnpm dev:weapp
```

打开微信开发者工具，进入首页，你会看到：
- 📡 **API 数据区块** - 实时显示 API 返回的网站信息
- 🔄 **加载状态** - 加载中会显示转圈
- ⚠️ **错误处理** - 失败时显示错误信息

### 2️⃣ 在其他页面使用 API (2 分钟)

**文件**: `src/pages/services/index.tsx`

```typescript
import { useGetApiCityList } from '../../api/web-api/web-api'

export default function Services() {
  const { data, isLoading } = useGetApiCityList()
  
  if (isLoading) return <div>加载城市列表...</div>
  
  return (
    <div>
      {data?.data?.map(city => (
        <div key={city.id}>{city.name}</div>
      ))}
    </div>
  )
}
```

### 3️⃣ 更新 API 文档后重新生成 (1 分钟)

```bash
# 当 Swagger 文档更新后，运行此命令重新生成 API 代码
pnpm api:gen

# 或者启用监听模式，自动更新
pnpm api:watch
```

---

## 📖 详细文档

### 选择适合你的文档

```
📚 初学者? → 阅读本文件 ✨ 快速开始指南
📚 需要示例? → 阅读 API_CALL_EXAMPLE.md
📚 需要详细说明? → 阅读 ORVAL_GUIDE.md
📚 需要使用模式? → 阅读 API_USAGE_GUIDE.md
📚 看完整总结? → 阅读 VERIFICATION_REPORT.md
📚 看改动明细? → 阅读 CHANGES_SUMMARY.md
```

---

## 🎯 常见任务

### 任务 1: 在新页面使用 API

```typescript
// 在你的组件中导入 hook
import { useGetApiCityList } from '@/api/web-api/web-api'

// 在组件中调用
const { data, isLoading, error } = useGetApiCityList()

// 使用数据
{data?.data?.map(item => <div key={item.id}>{item.name}</div>)}
```

### 任务 2: 手动触发 API 请求

```typescript
import { getApiCityList } from '@/api/web-api/web-api'
import { useQuery } from '@tanstack/react-query'

const { data, refetch } = useQuery({
  queryKey: ['cityList'],
  queryFn: ({ signal }) => getApiCityList(signal),
  enabled: false  // 不自动触发
})

// 点击按钮时手动调用
<button onClick={() => refetch()}>加载数据</button>
```

### 任务 3: 刷新已加载的数据

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { getGetApiCityListQueryKey } from '@/api/web-api/web-api'

const queryClient = useQueryClient()

const handleRefresh = () => {
  queryClient.invalidateQueries({ 
    queryKey: getGetApiCityListQueryKey() 
  })
}

<button onClick={handleRefresh}>刷新</button>
```

### 任务 4: 处理加载和错误状态

```typescript
const { data, isLoading, error } = useGetApiCityList()

// 加载中
if (isLoading) {
  return <div>加载中...</div>
}

// 出错
if (error) {
  return <div>出错: {error.message}</div>
}

// 成功
return <div>{data?.data?.map(...)}</div>
```

---

## 🔍 查看 API 调用

### 方法 1: 微信开发者工具

1. 打开微信开发者工具
2. 按 F12 打开调试窗口
3. 点击 Network 标签
4. 重新加载页面
5. 找到 `api/web/info` 的请求
6. 查看 Response 标签中的数据

### 方法 2: 控制台输出

```typescript
const { data, isLoading, error } = useGetApiCityList()

useEffect(() => {
  if (data) console.log('✅ 数据:', data)
  if (error) console.error('❌ 错误:', error)
}, [data, error])
```

### 方法 3: React Query DevTools

（在需要时添加开发者工具包）

```bash
pnpm add -D @tanstack/react-query-devtools
```

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function App() {
  return (
    <QueryProvider>
      {/* ... */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  )
}
```

---

## ⚙️ 配置 API 地址

### 修改 Swagger 文档 URL

编辑 `orval.config.js`:

```javascript
module.exports = {
  petstore: {
    input: 'http://你的-swagger-url/swagger/v1/swagger.json',  // ← 改这里
    // ...
  },
}
```

然后重新生成：

```bash
pnpm api:gen
```

### 修改请求超时时间

编辑 `src/utils/taroAxios.ts`:

```typescript
function convertAxiosToTaroConfig(axiosConfig: TaroRequestConfig) {
  const {
    url,
    method = 'GET',
    data,
    headers,
    params,
    timeout = 30000,  // ← 改这里，单位毫秒
    // ...
  } = axiosConfig
```

---

## 🧪 测试你的集成

### 快速测试清单

- [ ] 能否启动开发服务? `pnpm dev:weapp`
- [ ] 首页能否正常加载?
- [ ] 能否在调试工具中看到 API 请求?
- [ ] 能否在首页看到 API 返回的数据?
- [ ] 能否正常构建项目? `pnpm build:weapp`
- [ ] 能否刷新数据?
- [ ] 能否处理错误状态?

---

## 🐛 遇到问题?

### 问题 1: 数据没有加载

**检查**:
1. API 服务是否正在运行? 访问 `http://106.55.142.137/api/web/info`
2. 网络连接是否正常?
3. 控制台是否有错误信息?

**解决**:
```typescript
// 添加日志调试
const { data, error, isLoading } = useGetApiCityList()

useEffect(() => {
  console.log('isLoading:', isLoading)
  console.log('data:', data)
  console.log('error:', error)
}, [isLoading, data, error])
```

### 问题 2: 编译错误

**检查**:
1. 是否运行了 `pnpm install`?
2. API 代码是否生成? `ls src/api/web-api/web-api.ts`
3. 是否有 TypeScript 错误?

**解决**:
```bash
# 重新生成 API 代码
pnpm api:gen

# 重新安装依赖
pnpm install

# 清理缓存重新构建
rm -rf dist node_modules/.vite
pnpm build:weapp
```

### 问题 3: 跨域错误

**检查**:
1. API 服务器是否配置了 CORS?
2. 请求 URL 是否正确?

**解决**:
- 在开发环境使用代理
- 确保 API 服务器允许你的域名

---

## 📊 项目结构一览

```
repair/
├── src/
│   ├── app.tsx                    ✨ App 入口（包含 QueryProvider）
│   ├── pages/
│   │   ├── index/                 ✨ 首页（已集成 API 调用）
│   │   ├── services/              📝 服务页面
│   │   ├── orders/                📝 订单页面
│   │   └── profile/               📝 个人页面
│   ├── api/                       ✨ 自动生成的 API 代码
│   │   ├── web-api/
│   │   │   └── web-api.ts         ← React Query hooks
│   │   └── model/                 ← TypeScript 类型
│   ├── utils/
│   │   ├── taroAxios.ts           ✨ HTTP 适配器
│   │   └── queryClient.ts         ✨ React Query 配置
│   └── components/
│       └── Common/
│           └── queryClient.tsx    ✨ QueryProvider 包装
├── orval.config.js                ✨ Orval 配置
├── package.json                   ✨ 依赖配置
└── 📚 文档/
    ├── API_CALL_EXAMPLE.md
    ├── API_USAGE_GUIDE.md
    ├── ORVAL_GUIDE.md
    ├── VERIFICATION_REPORT.md
    ├── CHANGES_SUMMARY.md
    └── 本文件
```

---

## ✨ 核心概念速记

| 概念 | 说明 | 示例 |
|------|------|------|
| **Hook** | React Hooks，用来调用 API | `useGetApiCityList()` |
| **QueryKey** | 缓存的唯一标识 | `['api/city/list']` |
| **isLoading** | 是否在加载中 | `if (isLoading) return <Loading />` |
| **error** | 请求错误信息 | `if (error) return <Error msg={error} />` |
| **data** | 返回的数据 | `{data?.data?.map(...)}` |
| **refetch** | 手动重新加载 | `<button onClick={refetch}>刷新</button>` |
| **staleTime** | 数据有效期 | 5 分钟内不重新请求 |
| **gcTime** | 缓存保留时间 | 10 分钟后清理缓存 |

---

## 🎓 推荐学习路径

```
1. 阅读本文件 (5 分钟)
   └─> 了解基本概念和快速开始

2. 查看首页实现 (10 分钟)
   src/pages/index/index.tsx
   └─> 理解实际代码如何工作

3. 阅读 API_USAGE_GUIDE.md (15 分钟)
   └─> 学习常见使用模式

4. 尝试在其他页面使用 (15 分钟)
   └─> 动手实践

5. 阅读 ORVAL_GUIDE.md (20 分钟)
   └─> 深入理解配置和高级用法

总耗时: 约 1 小时，完全掌握整个系统
```

---

## 🎉 你已准备好了！

```
✅ API 集成完整
✅ 代码已编译
✅ 类型检查通过
✅ 首页已演示

现在你可以:
1. 在其他页面使用 API
2. 修改 Swagger 文档后自动生成代码
3. 自定义缓存策略
4. 添加错误处理
5. 扩展更多功能

祝你开发愉快！🚀
```

---

## 📞 需要帮助?

1. **查看首页实现**: `src/pages/index/index.tsx`
2. **查看 API 使用示例**: `API_USAGE_GUIDE.md`
3. **查看 Orval 配置**: `ORVAL_GUIDE.md`
4. **查看完整报告**: `VERIFICATION_REPORT.md`

---

**Happy Coding!** 🎊✨

