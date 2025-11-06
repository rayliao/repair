import Taro from '@tarojs/taro'
import { storage, host } from './config'
import { getCompany } from '../services/index'
import { getOpenId, login, getUserInfo as getInfoById } from '../services/user'

/**
 * 字符串裁切
 */
export const cutStr = (target, len = 10) => {
	if (typeof target === 'string') {
		return target.length > len ? `${target.substr(0, len)}...` : target
	}
	return target
}

/**
 * 接口请求
 */
export const request = (options: any, cb: Function) => {
  const user = Taro.getStorageSync(storage.user)
	Taro.request({
		success: (res: any) => {
			if (res.statusCode === 200) {
				if (res.data.code !== 0) {
					if (res.data.code === 401) {
						Taro.removeStorageSync(storage.user)
						toLogin()
					} else {
						Taro.showToast({
							title: res.data.message
						})
					}
				}
				cb(res.data)
			}
		},
		header: {
      'content-type': 'application/json',
			'X-Access-Token': user ? user.token : ''
		},
		mode: 'cors',
		...options,
		url: `${host}${options.url}`
	})
}

/**
 * 检查登录
 */
export const checkLogin = cb => {
	const user = Taro.getStorageSync(storage.user)
	if (!user) {
		toLogin()
	} else {
		cb()
	}
}

/**
 * 获取用户信息&微信登录
 */
export const getInfoAndLogin = async (
	e: any,
	type: any,
	toIndex: boolean = true
) => {
	Taro.setStorageSync(storage.type, type)
	const user = Taro.getStorageSync(storage.user)
	if (!user) {
		await wxLogin(e.detail.userInfo)
	}
	if (toIndex) {
		Taro.reLaunch({
			url: '../index/index'
		})
	}
}

/**
 * 通过openId获取用户信息
 */
export const getUserInfoByOpenId = () => {
	Taro.login({
		success(_res) {
			if (_res.code) {
				getOpenId(_res.code, res => {
					if (res.code === 0) {
						getInfoById(res.data.unionid, result => {
							if (result.code === 0) {
								Taro.setStorageSync(storage.user, {
									session_key: res.data.session_Key,
									token: res.data.unionid,
									userId: result.data.userID,
									companyId: result.data.companyID,
									userInfo: {
										nickName: result.data.nickName,
										avatarUrl: result.data.headImage
									},
									phone: result.data.phone
								})
								setSalerId(result.data.userID)
							}
						})
					}
				})
			} else {
				console.log(`登录失败`)
			}
		}
	})
}

/**
 * 授权提示
 */
export const toLogin = () => {
	Taro.showModal({
		title: '提示',
		content: '尚未授权，请前往登录授权',
		success: function(res) {
			if (res.confirm) {
				Taro.switchTab({
					url: '../user/index'
				})
			}
		}
	})
}

/**
 * 登录
 */
export const wxLogin = userInfo => {
	Taro.login({
		success(_res) {
			if (_res.code) {
				getOpenId(_res.code, res => {
					if (res.code === 0) {
						login(
							{
								OpenID: res.data.unionid,
								SessionKey: res.data.session_Key,
								NickName: userInfo!.nickName,
								HeadImg: userInfo!.avatarUrl
							},
							() => {
								Taro.setStorageSync(storage.user, {
									session_key: res.data.session_Key,
									token: res.data.unionid,
									userId: res.data.userID,
									companyId: res.data.companyID,
									userInfo
								})
								setSalerId(res.data.userID)
								console.log('登录成功')
							}
						)
					}
				})
			} else {
				console.log(`登录失败`)
			}
		}
	})
}

/**
 * 设置业务员id
 * @param sid
 */
export const setSalerId = sid => {
	const salerId = Taro.getStorageSync(storage.salerId)
	if (!salerId && parseInt(sid, 10) !== 0) {
		Taro.setStorageSync(storage.salerId, sid)
	}
}

/**
 * 报价装修风格
 */
export const decoration = ['经济实惠', '豪华套餐']

/**
 * 保存公司信息
 * @param cid 公司id
 */
export const saveCompany = (cid: number, cb?: Function) => {
	getCompany(cid, res => {
		if (res.code === 0) {
			cb && cb(res.data)
			Taro.setStorageSync(storage.company, res.data)
		}
	})
}

export const base64ToSrc = (data: string) => {
	const FILE_BASE_NAME = 'tmp_base64src'
	const fsm = Taro.getFileSystemManager()
	return new Promise((resolve, reject) => {
		const [, format, bodyData] =
			/data:image\/(\w+);base64,(.*)/.exec(data) || []
		if (!format) {
			reject(new Error('ERROR_BASE64SRC_PARSE'))
		}
		const filePath = `${Taro.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`
		const buffer = Taro.base64ToArrayBuffer(bodyData)
		fsm.writeFile({
			filePath,
			data: buffer,
			encoding: 'binary',
			success() {
				resolve(filePath)
			},
			fail() {
				reject(new Error('ERROR_BASE64SRC_WRITE'))
			}
		})
	})
}
