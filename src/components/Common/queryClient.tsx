/**
 * SWR 提供者
 * 为应用提供 SWR 上下文
 */
import { PropsWithChildren } from 'react'
import { SWRConfig } from 'swr'

/**
 * SWRConfig 组件包装
 */
export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 0, // 禁用自动刷新
        revalidateOnFocus: false, // 焦点时不重新验证
        revalidateOnReconnect: true, // 重连时重新验证
        shouldRetryOnError: true, // 错误时重试
        errorRetryCount: 2, // 最多重试2次
        errorRetryInterval: 1000, // 重试间隔1秒
      }}
    >
      {children}
    </SWRConfig>
  )
}
