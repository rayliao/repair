import Taro from '@tarojs/taro'

interface GlobalData {
	/**
	 * 报价页面类型
	 */
	priceType?: string
	/**
	 * 公司id
	 */
	cid: number
}

/**
 * 默认公司id
 */
export const defaultCid = 1036

/**
 * 全局变量
 */
export let globalData: GlobalData = {
	cid: defaultCid
}

/**
 * 更新全局变量
 * @param params 参数
 */
export const updateGlobalData = (params: GlobalData) => {
	globalData = {
		...globalData,
		...params
	}
}

/**
 * 设置全局变量
 * @param key 键
 * @param val 值
 */
export const setGlobalData = (key, val) => {
	globalData[key] = val
}

/**
 * API地址
 */
export const host = HOST

/**
 * 本地缓存存储
 */
export const storage = {
	company: 'COMPANY',
	salerId: 'SALERID',
	user: 'USER',
	type: 'TYPE'
}

/**
 * 是否是微信小程序
 */
export const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP
