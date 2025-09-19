import { request } from '../utils/index'

/**
 * 获取公司信息
 * @param Id 公司id
 * @param cb 回调
 */
export const getCompany = (Id: number, cb: Function) => {
	request(
		{
			url: '/company/info',
			method: 'GET',
			data: { Id }
		},
		cb
	)
}

/**
 * 获取公司团队
 * @param Id 公司id
 * @param cb 回调
 */
export const getCompanyTeam = (Id, cb: Function) => {
	request(
		{
			url: '/company/team',
			method: 'GET',
			data: { Id }
		},
		cb
	)
}

/**
 * 获取360全景
 * @param data 参数
 * @param cb 回调
 */
export const getPano = (
	data: { CompanyId: number; page: number },
	cb: Function
) => {
	request(
		{
			url: '/pano/list',
			method: 'GET',
			data
		},
		cb
	)
}
