import { View, Image, Navigator, Button } from '@tarojs/components'
import { getInfoAndLogin, saveCompany } from '../../utils/index'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import logo from '../../images/logo.png'
import { defaultCid, storage } from '../../utils/config'

class Entrance extends Taro.Component {
	config = {
		navigationBarTitleText: '登录'
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

  onShareAppMessage() {
		return {}
	}

	render() {
		return (
			<View className={styles.entrance}>
				<Image className={styles.logo} src={logo}></Image>
				<View className={styles.handle}>
					<Navigator url="../login/index?type=2" className={styles.btn}>
						业主登录
					</Navigator>
					<Button
						className={styles.btn}
						openType="getUserInfo"
						onGetUserInfo={this.tour}
					>
						游客模式
					</Button>
					<Navigator
						className={`${styles.btn} ${styles.btnAdmin}`}
						url="../login/index?type=3"
					>
						管理员登录
					</Navigator>
				</View>
			</View>
		)
	}
}

export default Entrance
