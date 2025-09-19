import Taro from '@tarojs/taro'
import Price from '../../components/Price'
import { View } from '@tarojs/components'
import styles from './index.module.scss'

class Gift extends Taro.Component {
	config = {
		navigationBarTitleText: '进店有礼'
	}

	onShareAppMessage() {
		return {}
	}

	render() {
		return (
			<View className={styles.content}>
				<Price source={4} />
			</View>
		)
	}
}

export default Gift
