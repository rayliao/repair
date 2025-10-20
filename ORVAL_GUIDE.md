# Orval + React Query + Taro 集成指南

## 概述

本项目使用 **Orval** 从 Swagger API 文档自动生成 TypeScript API 客户端，并与 **React Query** 和 **Taro.request** 完美集成，提供类型安全、自动缓存和数据管理的 API 调用方式。

## 核心技术栈

- **Orval**: OpenAPI/Swagger 到代码生成器
- **React Query (@tanstack/react-query)**: 异步数据管理库
- **Taro.request**: 跨平台网络请求 API
- **Axios**: HTTP 客户端（作为适配层）

## 项目结构

```
src/
├── api/                          # 生成的 API 代码（自动生成）
│   ├── web-api/                 # API 端点分组
│   │   └── web-api.ts           # 生成的 hooks 和请求方法
│   └── model/                    # 类型定义
│       ├── webServiceTypeDto.ts
│       ├── webServiceItemDto.ts
│       └── index.ts
├── utils/
│   ├── taroAxios.ts             # 自定义 Taro.request 适配器
│   ├── queryClient.tsx          # React Query 配置和 Provider
│   └── ...
└── pages/
    └── index/
        └── index.tsx            # 使用 API 的页面示例
```

## 快速开始

### 1. 生成 API 代码

运行以下命令从 Swagger 文档生成 API 代码：

```bash
# 一次性生成
pnpm api:gen

# 监听文件变化并自动生成
pnpm api:watch
```

生成的代码包括：
- 类型定义（DTO）
- React Query hooks（useQuery/useMutation）
- 直接请求方法

### 2. 在应用中集成 QueryProvider

在 `src/app.ts` 中包装 `QueryProvider`：

```typescript
import { QueryProvider } from './utils/queryClient'

class App extends Component<PropsWithChildren> {
  render() {
    return (
      <QueryProvider>
        {this.props.children}
      </QueryProvider>
    )
  }
}
```

### 3. 在组件中使用 API

#### 方式一：使用自动生成的 Hook（推荐）

```typescript
import { useGetApiWebInfo } from './api/web-api/web-api'

export function HomePage() {
  const { data, isLoading, error } = useGetApiWebInfo()

  if (isLoading) return <Text>加载中...</Text>
  if (error) return <Text>错误: {error.message}</Text>

  return (
    <View>
      <Text>{data?.siteName}</Text>
    </View>
  )
}
```

#### 方式二：使用直接请求方法

```typescript
import { getApiWebInfo } from './api/web-api/web-api'
import { useQuery } from '@tanstack/react-query'

export function HomePage() {
  const { data } = useQuery({
    queryKey: ['webInfo'],
    queryFn: ({ signal }) => getApiWebInfo(signal)
  })

  return <View>{data?.siteName}</View>
}
```

#### 方式三：使用 Mutation（创建/更新/删除）

```typescript
import { usePostApiWebService } from './api/web-api/web-api'

export function CreateService() {
  const { mutate, isPending } = usePostApiWebService()

  const handleCreate = () => {
    mutate({
      name: '服务名称',
      description: '描述'
    }, {
      onSuccess: () => {
        Taro.showToast({ title: '创建成功' })
      },
      onError: (error) => {
        Taro.showToast({ title: '创建失败' })
      }
    })
  }

  return (
    <Button onClick={handleCreate} disabled={isPending}>
      {isPending ? '创建中...' : '创建'}
    </Button>
  )
}
```

## 配置说明

### Orval 配置 (`orval.config.js`)

```javascript
module.exports = {
  api: {
    input: {
      // 指向 Swagger JSON 文件
      target: 'http://106.55.142.137/swagger/v1/swagger.json',
      validation: false
    },
    output: {
      mode: 'tags-split',           // 按 tag 分割生成文件
      target: './src/api',           // 输出目录
      schemas: './src/api/model',    // 类型定义目录
      client: 'react-query',         // 使用 React Query
      httpClient: 'axios',           // HTTP 客户端
      override: {
        mutator: {
          // 使用自定义的 Taro.request 适配器
          path: './src/utils/taroAxios.ts',
          name: 'createTaroAxiosInstance'
        }
      }
    }
  }
}
```

### React Query 配置 (`src/utils/queryClient.tsx`)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                    // 失败重试 1 次
      staleTime: 1000 * 60 * 5,   // 数据 5 分钟内不过期
      gcTime: 1000 * 60 * 10      // 10 分钟后清理缓存
    },
    mutations: {
      retry: 1
    }
  }
})
```

## Taro.request 适配器详解

`src/utils/taroAxios.ts` 提供了一个兼容 Axios 的适配器，使得 Orval 生成的代码能够使用 Taro.request：

**主要功能：**
- ✅ 将 Axios 配置转换为 Taro.request 配置
- ✅ 自动处理查询参数
- ✅ 设置超时控制
- ✅ 返回 Axios 兼容的响应格式
- ✅ 错误处理和 Promise 支持

**支持的方法：**
- `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`

## 常见用法

### 1. 带查询参数的请求

```typescript
const { data } = useGetApiWebServices({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    status: 'active'
  }
})
```

### 2. 带请求体的 POST 请求

```typescript
const { mutate } = usePostApiWebService()

mutate({
  name: '服务名',
  type: 'repair',
  price: 100
})
```

### 3. 请求拦截和错误处理

```typescript
const { mutate } = usePostApiWebService()

mutate(data, {
  onMutate: () => {
    // 请求前处理
    Taro.showLoading({ title: '加载中...' })
  },
  onSuccess: (data) => {
    Taro.hideLoading()
    Taro.showToast({ title: '成功' })
  },
  onError: (error) => {
    Taro.hideLoading()
    Taro.showToast({ title: error.message || '失败' })
  }
})
```

### 4. 手动刷新数据

```typescript
import { useQuery } from '@tanstack/react-query'
import { getGetApiWebInfoQueryKey } from './api/web-api/web-api'

export function HomePage() {
  const queryClient = useQueryClient()

  const handleRefresh = () => {
    // 刷新特定查询
    queryClient.invalidateQueries({
      queryKey: getGetApiWebInfoQueryKey()
    })
  }

  return <Button onClick={handleRefresh}>刷新</Button>
}
```

### 5. 全局错误处理

在 `src/app.ts` 中配置：

```typescript
import { queryClient } from './utils/queryClient'
import Taro from '@tarojs/taro'

queryClient.setDefaultOptions({
  queries: {
    retry: (failureCount, error: any) => {
      // 404 和认证错误不重试
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        return false
      }
      return failureCount < 1
    }
  }
})

// 全局错误监听
queryClient.getDefaultOptions().queries?.onError?.((error: any) => {
  Taro.showToast({
    title: error?.message || '请求失败',
    icon: 'error'
  })
})
```

## 类型支持

所有生成的 API 都有完整的 TypeScript 类型支持：

```typescript
import type { WebServiceTypeDto, WebInfo } from './api/model'

// 自动类型推导
const { data }: { data?: WebInfo } = useGetApiWebInfo()

// 请求参数类型检查
mutate({
  // 会有类型提示和检查
  name: 'service',
  price: 100
})
```

## 性能优化

### 1. 查询去重

React Query 会自动合并相同的查询：

```typescript
// 这两个请求会使用同一个缓存
useGetApiWebInfo()
useGetApiWebInfo()
```

### 2. 后台更新

```typescript
const { data, isRefetching } = useGetApiWebInfo({
  refetchInterval: 1000 * 60 // 每分钟自动更新
})
```

### 3. 乐观更新

```typescript
const { mutate } = usePutApiWebService()

mutate(data, {
  onMutate: async (newData) => {
    // 先更新本地缓存
    await queryClient.cancelQueries({
      queryKey: getGetApiWebInfoQueryKey()
    })
    const previousData = queryClient.getQueryData(getGetApiWebInfoQueryKey())
    queryClient.setQueryData(getGetApiWebInfoQueryKey(), newData)
    return { previousData }
  },
  onError: (err, newData, context) => {
    // 失败时回滚
    queryClient.setQueryData(
      getGetApiWebInfoQueryKey(),
      context?.previousData
    )
  }
})
```

## 故障排除

### 问题 1：CORS 错误

如果遇到跨域问题，确保 API 服务器正确配置了 CORS 头。

### 问题 2：类型不匹配

如果生成的类型有问题，检查 Swagger 文档的格式是否正确。

### 问题 3：请求超时

调整 Taro.request 的超时设置：

```typescript
// 在 src/utils/taroAxios.ts 中
timeout: 60000 // 增加到 60 秒
```

## 常用命令

```bash
# 生成 API 代码
pnpm api:gen

# 监听变化自动生成
pnpm api:watch

# 开发服务器
pnpm dev:weapp

# 构建
pnpm build:weapp

# 测试
pnpm test
```

## 相关资源

- [Orval 文档](https://orval.dev/)
- [React Query 文档](https://tanstack.com/query/latest)
- [Taro 文档](https://taro.jd.com/)
- [Swagger/OpenAPI 规范](https://swagger.io/specification/)

## 下一步

1. ✅ 运行 `pnpm api:gen` 生成 API 代码
2. ✅ 在 `src/app.ts` 中添加 `QueryProvider`
3. ✅ 在页面中使用生成的 hooks
4. ✅ 测试 API 调用和数据管理
5. 🔄 根据需要自定义生成配置

祝你使用愉快！🎉
