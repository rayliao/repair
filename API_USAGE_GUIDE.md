/**
 * API 集成使用示例
 * 演示如何在 Taro + React Query 中使用生成的 API
 */

// ==================== 1. 在 app.ts 中包装 QueryProvider ====================
// src/app.ts
import { QueryProvider } from './utils/queryClient'
import './app.scss'

class App extends Component<PropsWithChildren> {
  componentDidMount() {}

  render() {
    return (
      <QueryProvider>
        {/* 你的应用内容 */}
        {this.props.children}
      </QueryProvider>
    )
  }
}

export default App

// ==================== 2. 在页面组件中使用 API hooks ====================
// 示例：使用 getApiWebInfo hook 获取网站信息

import { Component, PropsWithChildren } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useGetApiWebInfo } from '../api/web-api/web-api'

// 这是一个函数组件示例
export function WebInfoPage() {
  const { data, isLoading, error } = useGetApiWebInfo()

  if (isLoading) return <Text>加载中...</Text>
  if (error) return <Text>加载失败: {error.message}</Text>

  return (
    <View className='web-info-page'>
      <Text className='title'>{data?.siteName}</Text>
      <Text className='description'>{data?.description}</Text>
      {/* ... 更多内容 */}
    </View>
  )
}

// ==================== 3. 带参数的请求示例 ====================
// 获取服务类型列表（假设 API 中存在这个端点）

import { useGetApiWebServices } from '../api/web-api/web-api'

export function ServicesPage() {
  const { data: services, isLoading } = useGetApiWebServices({
    queryParams: {
      pageNum: 1,
      pageSize: 10
    }
  })

  return (
    <View>
      {services?.map(service => (
        <View key={service.id} className='service-item'>
          <Text>{service.name}</Text>
        </View>
      ))}
    </View>
  )
}

// ==================== 4. 使用 Mutation（POST/PUT/DELETE） ====================
// 假设 API 中有创建服务的端点

import { usePostApiWebService } from '../api/web-api/web-api'

export function CreateServicePage() {
  const { mutate: createService, isPending } = usePostApiWebService()

  const handleSubmit = () => {
    createService(
      {
        name: '新服务',
        description: '服务描述'
      },
      {
        onSuccess: (data) => {
          Taro.showToast({
            title: '创建成功',
            icon: 'success'
          })
          console.log('创建的服务:', data)
        },
        onError: (error) => {
          Taro.showToast({
            title: '创建失败',
            icon: 'error'
          })
          console.error('错误:', error)
        }
      }
    )
  }

  return (
    <View>
      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? '创建中...' : '创建服务'}
      </Button>
    </View>
  )
}

// ==================== 5. 手动查询配置（高级用法） ====================
import { useQuery } from '@tanstack/react-query'
import { getApiWebInfo, getGetApiWebInfoQueryKey } from '../api/web-api/web-api'

export function CustomQueryPage() {
  const { data, isLoading } = useQuery({
    queryKey: getGetApiWebInfoQueryKey(),
    queryFn: ({ signal }) => getApiWebInfo(signal),
    staleTime: 1000 * 60 * 5, // 5 分钟内不重新获取
    gcTime: 1000 * 60 * 10, // 10 分钟后清理缓存
  })

  return <View>...</View>
}

// ==================== 6. 类组件中使用 Hook（使用高阶组件） ====================
import { useGetApiWebInfo as useWebInfo } from '../api/web-api/web-api'

function withWebInfo<P extends object>(
  Component: React.ComponentType<P & { webInfo?: any }>
) {
  return (props: P) => {
    const webInfo = useWebInfo()
    return <Component {...props} webInfo={webInfo} />
  }
}

@withWebInfo
class MyPage extends Component<PropsWithChildren> {
  render() {
    const { webInfo } = this.props as any
    return <View>{webInfo?.data?.siteName}</View>
  }
}
