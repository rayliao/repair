// 工地
import { request } from '../utils/index'

/**
 * 获取工地列表
 */
export const getList = (
	data: { companyId?: number; salerId?: number; page: number },
	cb: Function
) => {
	request(
		{
			url: '/project/list',
			method: 'GET',
			data
		},
		cb
	)
}

/**
 * 获取工地详情
 */
export const getDetail = (
	data: { id: number; salerId: number },
	cb: Function
) => {
	request(
		{
			url: '/project/detail',
			method: 'GET',
			data
		},
		cb
	)
}

/**
 * 获取工地动态列表
 */
export const getDynamic = (data: { id: number }, cb: Function) => {
	request(
		{
			url: '/project/dynamic',
			method: 'GET',
			data
		},
		cb
	)
}

/**
 * 获取工地动态详情
 */
export const getDynamicView = (id: string, cb: Function) => {
	request(
		{
			url: '/project/dynamicview',
			method: 'GET',
			data: { id }
		},
		cb
	)
}

/**
 * 评论
 */
export const addComment = (
	data: { ID: number; ProjectID: number; Content: string },
	cb: Function
) => {
	request(
		{
			url: '/comment/add',
			method: 'POST',
			data: JSON.stringify(data)
		},
		cb
	)
}

/**
 * 点赞
 */
export const addLike = (
	data: { ID: number; ProjectID: number },
	cb: Function
) => {
	request(
		{
			url: '/like/add',
			method: 'POST',
			data: JSON.stringify(data)
		},
		cb
	)
}

/**
 * 通过工地项目编号查询工地ID
 * @param pn 工地项目编号
 * @param cb 回调
 */
export const getPnumber = (pn: string, cb: Function) => {
	request(
		{
			url: '/project/pnumber',
			method: 'GET',
			data: { pn }
		},
		cb
	)
}

/**
 * 获取工地页面小程序码
 * @param data 参数
 * @param cb 回调
 */
export const getUnlimited = (
	data: { pid: string; sid: string; cid: string },
	cb: Function
) => {
	request(
		{
			url: '/project/getunlimited',
			methond: 'GET',
			data
		},
		cb
	)
}

/**
 * 获取我的工地列表
 */
export const getMyProject = (cb: Function) => {
	request(
		{
			url: '/project/my',
			method: 'GET'
		},
		cb
	)
}
