# 🚀 Orval + React Query + Taro 集成项目

一个完整的、生产就绪的 Taro 小程序项目，集成了 Orval 自动 API 代码生成、React Query 数据管理和 Taro.request 网络请求。

## 📦 项目特性

✨ **核心特性**
- 🔄 **自动 API 生成**: 从 Swagger 文档自动生成类型安全的 API 客户端
- 🎯 **React Query 集成**: 自动缓存、重试、去重等数据管理功能
- 📱 **Taro 兼容**: 完美支持 Taro 框架的跨平台编译
- 🏠 **底部 TabBar**: 4 个页面的完整导航结构
- 🎨 **NutUI 组件库**: 现代化的 UI 组件和样式
- 📘 **完整文档**: 详细的集成指南和使用示例

## 🛠 技术栈

```json
{
  "前端框架": "Taro 4.1.6",
  "UI 组件库": "NutUI React Taro 3.0.19",
  "数据管理": "@tanstack/react-query 5.90.5",
  "API 生成": "Orval 7.13.2",
  "网络请求": "Taro.request + Axios 适配器",
  "语言": "TypeScript",
  "样式": "Sass/SCSS"
}
```

## 📁 项目结构

```
repair/
├── src/
│   ├── api/                        # Orval 生成的 API 代码
│   │   ├── web-api/               # API 分组（自动生成）
│   │   └── model/                 # 类型定义（自动生成）
│   ├── components/                # React 组件
│   │   └── Common/                # 通用组件
│   ├── pages/                     # 页面
│   │   ├── index/                 # 首页 (API 集成示例)
│   │   ├── services/              # 全部服务
│   │   ├── orders/                # 我的订单
│   │   └── profile/               # 个人中心
│   ├── utils/
│   │   ├── taroAxios.ts           # Taro.request 适配器
│   │   ├── queryClient.tsx        # React Query 配置
│   │   └── ...
│   ├── app.ts                     # 应用入口
│   └── app.config.ts              # Taro 配置
├── config/                        # Taro 构建配置
├── orval.config.js                # Orval 配置
├── package.json
├── ORVAL_GUIDE.md                # Orval 详细指南
├── API_USAGE_GUIDE.md             # API 使用示例
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 生成 API 代码

```bash
# 首次生成
pnpm api:gen

# 监听变化自动生成
pnpm api:watch
```

### 3. 在应用中集成 QueryProvider

编辑 `src/app.ts`:

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

### 4. 开发和构建

```bash
# 开发小程序
pnpm dev:weapp

# 构建小程序
pnpm build:weapp

# 开发 H5
pnpm dev:h5

# 其他平台...
pnpm dev:swan      # 百度小程序
pnpm dev:alipay    # 支付宝小程序
pnpm dev:tt        # 抖音小程序
```

## 💡 核心功能说明

### API 生成流程

1. **Swagger 文档** → Orval 解析
2. **Orval** → 生成 TypeScript 类型和 hooks
3. **自定义适配器** → 将 Axios 转换为 Taro.request
4. **React Query** → 自动缓存和数据管理

```
http://106.55.142.137/swagger/v1/swagger.json
         ↓
      Orval
         ↓
    自动生成 API 代码
         ↓
  src/api/web-api/web-api.ts (hooks 和方法)
  src/api/model/                (类型定义)
```

### 自定义 Taro 适配器

`src/utils/taroAxios.ts` 提供了一个完整的适配层，使得：
- ✅ Orval 生成的代码可以直接使用 Taro.request
- ✅ 支持 Axios 兼容的请求配置
- ✅ 返回 Axios 兼容的响应格式
- ✅ 自动处理查询参数、超时等

### 页面导航

使用微信小程序原生 tabBar：

```
┌─────────────────────────────────┐
│        首页 | 服务 | 订单 | 我的  │
│                                 │
│                                 │
│     页面内容                     │
│                                 │
│                                 │
├─────────────────────────────────┤
│ 首页  | 全部服务 | 订单 | 我的  │
└─────────────────────────────────┘
```

## 📚 文档

### 主要文档

| 文档 | 内容 |
|------|------|
| `ORVAL_GUIDE.md` | 完整的 Orval 集成指南 |
| `API_USAGE_GUIDE.md` | API 使用示例和代码片段 |
| `ORVAL_GUIDE.md` | 性能优化和高级用法 |

### 快速参考

**查询数据（GET）**
```typescript
import { useGetApiWebInfo } from './api/web-api/web-api'

const { data, isLoading, error } = useGetApiWebInfo()
```

**修改数据（POST/PUT/DELETE）**
```typescript
import { usePostApiWebService } from './api/web-api/web-api'

const { mutate, isPending } = usePostApiWebService()
mutate({ name: 'Service' }, {
  onSuccess: () => { /* ... */ }
})
```

**刷新数据**
```typescript
const queryClient = useQueryClient()
queryClient.invalidateQueries({
  queryKey: getGetApiWebInfoQueryKey()
})
```

## 🎯 常见任务

### 更新 API 文档

如果 Swagger 文档更新了，重新运行生成：

```bash
pnpm api:gen
```

### 添加新页面

1. 创建页面目录 `src/pages/xxx`
2. 创建 `index.tsx`, `index.config.ts`, `index.scss`
3. 在 `app.config.ts` 中添加页面路由
4. 在 tabBar 中添加导航（可选）

### 自定义 API 请求

编辑 `orval.config.js` 和 `src/utils/taroAxios.ts`:

```javascript
// orval.config.js
module.exports = {
  api: {
    output: {
      baseUrl: 'your-api-url',
      override: {
        // 自定义选项
      }
    }
  }
}
```

## 🔧 配置文件

### orval.config.js

```javascript
module.exports = {
  api: {
    input: {
      target: 'http://106.55.142.137/swagger/v1/swagger.json'
    },
    output: {
      mode: 'tags-split',          // 按 tag 分组
      target: './src/api',          // 输出目录
      client: 'react-query',        // 使用 React Query
      httpClient: 'axios'           // HTTP 客户端
    }
  }
}
```

### Taro 配置

查看 `config/index.ts` 中的完整配置，包括：
- NutUI 尺寸适配（375/750）
- HTML 插件配置
- 缓存和优化设置

## 📊 API 配置

**基础 URL**: `http://106.55.142.137`

**超时时间**: 30 秒

**重试策略**: 失败自动重试 1 次

**缓存策略**:
- Query: 5 分钟内不重新获取
- Cache: 10 分钟后清理

## 🐛 故障排除

### 问题：API 生成失败

**解决方案**:
- 检查 Swagger URL 是否可访问
- 验证 Swagger 文档格式是否正确
- 查看控制台错误信息

### 问题：请求超时

**解决方案**:
- 增加 `taroAxios.ts` 中的 timeout 值
- 检查网络连接
- 查看 API 服务器状态

### 问题：类型错误

**解决方案**:
- 重新运行 `pnpm api:gen`
- 检查 Swagger 文档中的类型定义
- 手动修正生成的类型文件

## 🚀 性能优化

### 1. 查询去重

React Query 会自动合并相同的查询请求。

### 2. 背景更新

```typescript
const { data } = useGetApiWebInfo({
  refetchInterval: 1000 * 60  // 每分钟更新
})
```

### 3. 乐观更新

参考 `ORVAL_GUIDE.md` 的"乐观更新"部分。

## 🤝 贡献指南

欢迎贡献改进！请遵循以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的变更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 许可证

MIT

## 📞 联系方式

如有问题或建议，欢迎提出 Issue 或 PR。

## 🎉 致谢

感谢以下开源项目的支持：
- [Taro](https://taro.jd.com/) - 跨平台开发框架
- [Orval](https://orval.dev/) - OpenAPI 代码生成
- [React Query](https://tanstack.com/query/) - 数据管理
- [NutUI](https://nutui.jd.com/) - UI 组件库

---

**祝你开发愉快！** 🚀✨

上次更新: 2025-10-17
