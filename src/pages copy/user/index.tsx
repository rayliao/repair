import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Block, Button, Input } from '@tarojs/components'
import styles from './index.module.scss'
import { getInfoAndLogin, saveCompany, setSalerId } from '../../utils/index'
import { storage, defaultCid, isWeapp, setGlobalData } from '../../utils/config'
import { codeUrl } from '../../utils/web'
import { getPhone, getUserInfo } from '../../services/user'
import { gzhAccessToken, gzhUserInfo } from '../../services/web'
import { getMyProject } from '../../services/project'
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import ProjectItem from '../../components/ProjectItem'
import Loading from '../../components/Loading'
import Common from '../../components/Common'
import toolBg from './tool-bg.jpg'
import queryString from 'query-string'

interface UserState {
	hasPhone: boolean
	list: any | null
	showModal: boolean
	pwd: string
}

export default class User extends Component {
	state: UserState = {
		hasPhone: false,
		list: null,
		showModal: false,
		pwd: ''
	}
	/**
	 * 指定config的类型声明为: Taro.Config
	 *
	 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
	 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
	 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
	 */
	config: Config = {
		navigationBarTitleText: '个人中心'
	}

	componentWillMount() {
		const user = Taro.getStorageSync(storage.user)
		if (user) {
			getMyProject(res => {
				if (res.code === 0) {
					this.setState({
						list: res.data
					})
				}
			})
		} else {
			this.setState({
				list: []
			})
		}
	}

	getPhone = e => {
		const user = Taro.getStorageSync(storage.user)
		const { encryptedData, iv } = e.detail
		const self = this
		getPhone(
			{
				OpenID: user.token,
				session_key: user.session_key,
				iv,
				encryptedData
			},
			res => {
				if (res.code === 0) {
					Taro.setStorageSync(storage.user, {
						...user,
						phone: res.data
					})
					self.setState({
						hasPhone: true
					})
				}
			}
		)
	}

	onShareAppMessage() {
		return {}
	}

	/**
	 * 游客模式
	 */
	tour = async e => {
		const company = Taro.getStorageSync(storage.company)
		if (company.id !== defaultCid) {
			await saveCompany(defaultCid)
		}
		getInfoAndLogin(e, 1)
	}

	/**
	 * web端登录
	 */
	login_web = () => {
		const qs: any = queryString.parse(document.location.search)
		if (qs.code) {
			gzhAccessToken(qs.code, result => {
				if (result.code === 0) {
					gzhUserInfo(
						{
							access_token: result.data.access_token,
							openid: result.data.openid
						},
						async res => {
							if (res.code === 0) {
								if (res.data.unionid) {
									getUserInfo(res.data.unionid, async r => {
										if (r.code === 0) {
											await Taro.setStorageSync(storage.user, {
												token: res.data.unionid,
												userId: r.data.userID,
												companyId: r.data.companyID,
												userInfo: {
													nickName: r.data.nickName,
													avatarUrl: r.data.headImage
												},
												phone: r.data.phone
											})
											await setSalerId(r.data.userID)
											document.location.href = `${document.location.origin}/${document.location.hash}`
										}
									})
								} else {
									Taro.showToast({
										icon: 'none',
										title: '拿不到unionid'
									})
								}
							}
						}
					)
				}
			})
		}
	}

	/**
	 * Web端跳转
	 */
	redirect_web = () => {
		const qs: any = queryString.parse(document.location.search)
		if (!isWeapp && !qs.code) {
			document.location.href = codeUrl()
		}
	}

	/**
	 * 跳转到团队
	 * @param cid
	 */
	goToTeam = cid => {
		const intCid = parseInt(cid, 10)
		setGlobalData('cid', intCid)
		saveCompany(intCid, () => Taro.switchTab({ url: '../team/index' }))
	}

	confirmModal = () => {
		if (this.state.pwd.toString() === '1008611') {
			Taro.navigateTo({
				url: '/pages/tool/index'
      })
      this.setState({
        showModal: false
      })
		} else {
      Taro.showToast({
        icon: 'none',
        title: '密码错误'
      })
    }
	}

	render() {
		if (!isWeapp) {
			this.login_web()
		}
		// const type = Taro.getStorageSync(storage.type)
		const company = Taro.getStorageSync(storage.company)
		const user = Taro.getStorageSync(storage.user)
		if (!isWeapp && process.env.NODE_ENV === 'development' && !user) {
			const unionid = 'ocfrMt1LzN8LYv3EnPrI6UaBMBV4'
			Taro.setStorageSync(storage.user, {
				token: unionid,
				userId: 8,
				companyId: 1021,
				userInfo: {
					nickName: 'rayliao',
					avatarUrl:
						'http://thirdwx.qlogo.cn/mmopen/vi_32/W2enQKiauSfEUV7IOoqI6fhtx5Kawvjf0yTzV4ibFHoUtD1e9ed2P5qQqlTaCjuItdsp1SzwJkKq1XRuRtQcacVA/132'
				},
				phone: '16620038893'
			})
			setSalerId(8)
		}
		const { userInfo } = user
		const { list, showModal, pwd } = this.state
		return (
			<Common current={4}>
				<View className={styles.user}>
					{userInfo ? (
						<Block>
							<View className={styles.userinfo}>
								<Image className={styles.avatar} src={userInfo.avatarUrl} />
								<View
									style={{
										display: 'flex',
										flexDirection: 'column'
									}}
								>
									<Text className={styles.nickname}>{userInfo.nickName}</Text>
									<Text className={styles.nickname}>{user.phone}</Text>
								</View>
							</View>
							<View className={styles.btnWrap}>
								{/* <Navigator className={styles.nav} url="../entrance/index">
									{type === '2' || type === '3' ? '切换账号' : '登录'}
								</Navigator> */}
								{!this.state.hasPhone && !user.phone ? (
									<Button
										className={styles.btn}
										openType="getPhoneNumber"
										onGetPhoneNumber={this.getPhone}
									>
										绑定手机号
									</Button>
								) : null}
								{user.companyId !== 0 && user.companyId !== company.id ? (
									<Button
										onClick={() => this.goToTeam(user.companyId)}
										className={styles.btnPrimary}
									>
										返回我的公司
									</Button>
								) : null}
							</View>
						</Block>
					) : (
						// <Navigator className={styles.button} url="../entrance/index">
						// 	登录
						// </Navigator>
						<Button
							className={styles.button}
							onClick={this.redirect_web}
							openType="getUserInfo"
							onGetUserInfo={this.tour}
						>
							登录
						</Button>
					)}
				</View>
				<View className={styles.list}>
					<View className={styles.title}>我的常用工具：</View>
					<Image
						onClick={() => this.setState({ showModal: true })}
						className={styles.toolBg}
						mode="aspectFill"
						src={toolBg}
					/>
				</View>
				<View className={styles.list}>
					<View className={styles.title}>我的工地：</View>
					{!list ? (
						<Loading />
					) : list.length ? (
						list.map(item => (
							<ProjectItem
								openType="redirect"
								key={item.id}
								item={item}
								userId={item.salerId}
							/>
						))
					) : (
						<View className={styles.noData}>暂无数据</View>
					)}
				</View>
				<AtModal isOpened={showModal}>
					<AtModalContent>
						<Input
							name="pwd"
							type="text"
							password={true}
							maxLength={20}
							placeholder="输入密码"
							className={styles.input}
							value={pwd}
							onInput={e => this.setState({ pwd: e.detail.value })}
						/>
					</AtModalContent>
					<AtModalAction>
						<Button onClick={() => this.setState({ showModal: false })}>
							取消
						</Button>
						<Button onClick={this.confirmModal}>进入</Button>
					</AtModalAction>
				</AtModal>
			</Common>
		)
	}
}
