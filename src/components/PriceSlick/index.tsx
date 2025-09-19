import { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import { getQuote } from '../../services/user'
import { globalData } from '../../utils/config'
import styles from './index.module.scss'

interface PriceSlickProps {
	hasTitle?: boolean
}

class PriceSlick extends Component<PriceSlickProps, any> {
	state = {
		list: []
	}
	componentDidMount() {
		getQuote(globalData.cid!, res => {
			if (res.code === 0) {
				this.setState({
					list: res.data
				})
			}
		})
	}
	render() {
		const { list } = this.state
		const { hasTitle } = this.props
		return list.length ? (
			<View>
				{hasTitle && <View className={styles.title}>最新报价</View>}
				<Swiper
					className={styles.tip}
					autoplay={true}
					vertical={true}
					circular={true}
				>
					{list.map((item, index) => (
						<SwiperItem key={index}>
							<View className={styles.tipItem}>
								<View className={styles.circle} />
								{item}
							</View>
						</SwiperItem>
					))}
				</Swiper>
			</View>
		) : null
	}
}

export default PriceSlick
