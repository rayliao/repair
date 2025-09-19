import Taro, { Component } from '@tarojs/taro'
import { Navigator, Image } from '@tarojs/components'
import styles from './index.module.scss'
import bg from './bg.png'

interface GiftEnterProps {}

class GiftEnter extends Component<GiftEnterProps, any> {
	render() {
		return (
			<Navigator className={styles.tada} url="../gift/index">
				<Image className={styles.img} src={bg} mode="widthFix" />
			</Navigator>
		)
	}
}

export default GiftEnter
