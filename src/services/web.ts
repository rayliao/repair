import { request } from '../utils/index'

/**
 * 获取AccessToken
 * @param code
 * @param cb
 */
export const gzhAccessToken = (code: string, cb: Function) => {
	request(
		{
			url: '/gzh/accesstoken',
			method: 'GET',
			data: {
				code,
				dev: process.env.NODE_ENV === 'development' ? 1 : ''
			}
		},
		cb
	)
}

/**
 * 获取用户信息
 * @param data
 * @param cb
 */
export const gzhUserInfo = (
	data: { access_token: string; openid: string },
	cb: Function
) => {
	request(
		{
			url: '/gzh/userinfo',
			method: 'GET',
			data
		},
		cb
	)
}

/**
 * 获取微信签名
 * @param data
 * @param cb
 */
export const gzhGetSignature = (data, cb: Function) => {
  request({
    url: '/gzh/getsignature',
    method: 'GET',
    data
  }, cb)
}
