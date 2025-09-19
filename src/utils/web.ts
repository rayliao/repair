/**
 * 公众号ID
 */
const appid =
	process.env.NODE_ENV === 'development'
		? 'wx21f68481c3d61fc0'
		: 'wx31d590ee4a01ed1d'

export const codeUrl = () => {
	const url = encodeURIComponent(document.location.href.split('?')[0])
	return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo#wechat_redirect`
}
