// 文章案例
import { request } from '../utils/index'

/**
 * 获取文章列表
 * category: 1-精品案例，2-家装知识
 */
export const getArticleList = (
	data: { CompanyId: number; category: number; page: number },
	cb: Function
) => {
	request(
		{
			url: '/article/list',
			method: 'GET',
			data
		},
		cb
	)
}

/**
 * 获取文章详情
 */
export const getArticleDetail = (id: string, cb: Function) => {
	request(
		{
			url: '/article/detail',
			method: 'GET',
			data: { id }
		},
		cb
	)
}

/**
 * 获取轮播图
 * @param cid 公司id
 * @param cb 回调
 */
export const getWheel = (cid: number, cb: Function) => {
	request(
		{
			url: '/article/wheel',
			method: 'GET',
			data: { companyId: cid }
		},
		cb
	)
}
