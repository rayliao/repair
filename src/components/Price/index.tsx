import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import styles from './index.module.scss'
import PriceForm from '../PriceForm'
import PriceSlick from '../PriceSlick'
import tZero from './t0.jpg'
import tOne from './t1.jpg'
import tTwo from './t2.jpg'

interface PriceProps {
	/**
	 * 1-获取报价，2-预约设计师，3-预约参观工地, 4-进店有礼
	 */
	source: number
}

const typeImgs = [tZero, tOne, tTwo]

export default class Price extends Component<PriceProps, any> {
	render() {
		const { source } = this.props
		return (
			<View>
				{source !== 4 ? (
					<Image
						className={styles.banner}
						src={typeImgs[source - 1]}
						mode="widthFix"
					/>
				) : null}
				<View
					className={`${styles.content} ${
						source === 4 ? styles.giftContent : ''
					}`}
				>
					{source === 4 ? <View className={styles.title}>活动说明</View> : null}
					<View className={source === 4 ? styles.gift : ''}>
						<PriceForm source={source} />
						{source !== 4 ? <PriceSlick hasTitle /> : null}
					</View>
				</View>
			</View>
		)
	}
}
