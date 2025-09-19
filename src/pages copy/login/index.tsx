import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Form, Input, Button, Block } from '@tarojs/components'
import logo from '../../images/logo.png'
import { setGlobalData, storage } from '../../utils/config'
import { getInfoAndLogin, saveCompany } from '../../utils/index'
import { getPnumber } from '../../services/project'
import { userCheck } from '../../services/user'
import styles from './index.module.scss'
import tip from './tip.png'

export default class Login extends Component {
	/**
	 * 指定config的类型声明为: Taro.Config
	 *
	 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
	 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
	 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
	 */
	config: Config = {
		navigationBarTitleText: '登录'
	}

	formSubmit(e) {
		const { type } = this.$router.params
		if (type === '2') {
			const { pn } = e.detail.value
			if (!pn) {
				Taro.showToast({
					icon: 'none',
					title: '请输入工地编号'
				})
				return
			}
			getPnumber(pn, res => {
				if (res.code === 0) {
					this.redirect(res.data.companyId)
				}
			})
		} else {
			const { userName, pwd } = e.detail.value
			if (!userName) {
				Taro.showToast({
					icon: 'none',
					title: '请输入用户名'
				})
				return
			}
			if (!pwd) {
				Taro.showToast({
					icon: 'none',
					title: '请输入密码'
				})
				return
			}
			userCheck({ name: userName, password: pwd }, res => {
				if (res.code === 0) {
          Taro.setStorageSync(storage.salerId, res.data.id)
					this.redirect(res.data.companyID)
				}
			})
		}
	}

	redirect = cid => {
		setGlobalData('cid', cid)
		saveCompany(cid, () => {
			Taro.reLaunch({
				url: '../index/index'
			})
		})
	}

	getUserInfo = e => {
		getInfoAndLogin(e, this.$router.params.type, false)
  }

  onShareAppMessage() {
		return {}
	}

	render() {
		const { type } = this.$router.params
		return (
			<View className={styles.login}>
				<Image className={styles.logo} src={logo} />
				<Form className={styles.formLogin} onSubmit={this.formSubmit}>
					{type === '2' ? (
						<View className={styles.formItem}>
							<Image className={styles.tip} src={tip} mode="widthFix" />
							<Input
								name="pn"
								type="text"
								maxLength={20}
								className={styles.input}
								placeholder="输入工地编号加入工地管理"
							/>
						</View>
					) : (
						<Block>
							<View className={styles.formItem}>
								<View className={styles.name}>用户名</View>
								<Input
									name="userName"
									type="text"
									maxLength={50}
									className={styles.input}
									placeholder="请输入用户名"
								/>
							</View>
							<View className={styles.formItem}>
								<View className={styles.name}>密码</View>
								<Input
									name="pwd"
									password={true}
									maxLength={20}
									className={styles.input}
									placeholder="请输入密码"
								/>
							</View>
						</Block>
					)}
					<View className={styles.formHandle}>
						<Button
							className={styles.button}
							openType="getUserInfo"
							onGetUserInfo={this.getUserInfo}
							formType="submit"
						>
							{type === '2' ? '登录' : '管理员登录'}
						</Button>
					</View>
				</Form>
			</View>
		)
	}
}
