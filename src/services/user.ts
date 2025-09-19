import { request } from '../utils/index'

/**
 * 获取openid
 */
export const getOpenId = (code: string, cb: Function) => {
	request(
		{
			url: '/user/openId',
			method: 'GET',
			data: { js_code: code }
		},
		cb
	)
}

/**
 * 获取手机号码
 * @param data
 * @param cb
 */
export const getPhone = (
	data: {
		OpenID: string
		encryptedData: string
		iv: string
		session_key: string
	},
	cb: Function
) => {
	request(
		{
			url: '/user/phone',
			method: 'POST',
			data
		},
		cb
	)
}

/**
 * 用户登录到系统
 */
export const userCheck = (
	data: { name: string; password: string },
	cb: Function
) => {
	request(
		{
			url: '/user/check',
			method: 'POST',
			data
		},
		cb
	)
}

/**
 * 用户注册或登录到系统
 */
export const login = (
	data: {
		OpenID: string
		SessionKey: string
		NickName: string
		HeadImg: string
	},
	cb: Function
) => {
	request(
		{
			url: '/user/login',
			method: 'POST',
			data
		},
		cb
	)
}

/**
 * 获取报价
 */
export const getQuote = (companyId: number, cb: Function) => {
	request(
		{
			url: '/user/quote',
			method: 'GET',
			data: { companyId }
		},
		cb
	)
}

/**
 * 提交报价
 */
export const addQuote = (
	data: {
		CompanyId: number
		salerId: number
		Size: string
		Phone: string
		/**
		 * 1-获取报价，2-预约设计师，3-预约参观工, 4-进店有礼
		 */
		Type: number
		source: number
	},
	cb: Function
) => {
  console.log(data)
	request(
		{
			url: '/user/addquote',
			method: 'POST',
			data
		},
		cb
	)
}

/**
 * 通过openId获取用户信息
 */
export const getUserInfo = (openId: string, cb: Function) => {
	request(
		{
			url: '/user/info',
			method: 'GET',
			data: { openId }
		},
		cb
	)
}
