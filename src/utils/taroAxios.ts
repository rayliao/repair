/**
 * 自定义 HTTP 适配器 - 整合 Taro.request 和 React Query
 * 用于 Orval 生成的 API 请求
 */
import Taro from '@tarojs/taro'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '../store/userStore'

interface TaroRequestConfig extends AxiosRequestConfig {
  timeout?: number
  sslVerify?: boolean
  enableHttp2?: boolean
  enableQuic?: boolean
  enableCache?: boolean
  dataType?: 'json' | 'text' | 'arraybuffer'
}

/**
 * 将 Axios 配置转换为 Taro.request 配置
 */
function convertAxiosToTaroConfig(axiosConfig: TaroRequestConfig) {
  const {
    url,
    method = 'GET',
    data,
    headers,
    params,
    timeout = 30000,
    ...rest
  } = axiosConfig

  // 处理 URL - 如果是相对路径，添加 HOST
  let finalUrl = url || ''
  if (finalUrl.startsWith('/')) {
    // @ts-ignore - HOST 是通过 defineConstants 注入的全局变量
    finalUrl = `${HOST}${finalUrl}`
  }

  // 处理查询参数
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString()
    finalUrl = `${finalUrl}${finalUrl.includes('?') ? '&' : '?'}${queryString}`
  }

  // 从 store 获取 token (openId) 并添加到请求头
  const token = useUserStore.getState().token
  const finalHeaders = {
    ...headers,
    ...(token ? { openid: token } : {})
  }

  return {
    url: finalUrl,
    method: method?.toUpperCase() as any,
    data: data || undefined,
    header: finalHeaders,
    timeout,
    enableCache: false,
    dataType: 'json' as const,
    ...rest
  }
}

/**
 * 使用 Taro.request 发送网络请求
 */
export async function taroRequest<T = any>(
  config: TaroRequestConfig
): Promise<AxiosResponse<T>> {
  try {
    const taroConfig = convertAxiosToTaroConfig(config)

    console.log('🌐 [taroRequest] 发送请求:', {
      url: taroConfig.url,
      method: taroConfig.method,
      timeout: taroConfig.timeout
    });

    return new Promise((resolve, reject) => {
      Taro.request({
        ...taroConfig,
        success: (res: any) => {
          console.log('✅ [taroRequest] 请求成功:', {
            status: res.statusCode,
            data: res.data
          });

          // 转换为 Axios 响应格式
          const response: AxiosResponse<T> = {
            data: res.data,
            status: res.statusCode,
            statusText: res.statusCode === 200 ? 'OK' : 'ERROR',
            headers: res.header || {},
            config: config as any,
            request: res as any
          }
          resolve(response)
        },
        fail: (err: any) => {
          console.error('❌ [taroRequest] 请求失败:', err);
          reject(err)
        },
        complete: () => {
          // 可选：统一处理完成逻辑
        }
      } as any)
    })
  } catch (error) {
    console.error('❌ [taroRequest] 异常:', error);
    return Promise.reject(error)
  }
}

/**
 * 创建基于 Taro.request 的 Axios 兼容实例
 *
 * 对于 React Query 使用：自动返回 data 属性
 * 对于其他使用：返回完整的 AxiosResponse
 */
export function createTaroAxiosInstance<T = any>(config?: TaroRequestConfig): Promise<T> {
  return taroRequest<T>(config || {}).then(response => response.data);
}
