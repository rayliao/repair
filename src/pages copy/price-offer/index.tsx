import Taro, { Component } from '@tarojs/taro'
import Price from '../../components/Price'
import Common from '../../components/Common'

export default class PriceOffer extends Component {
	config = {
		navigationBarTitleText: '维修报价'
	}

	onShareAppMessage() {
		return {}
	}

	render() {
		return (
			<Common current={2}>
				<Price source={1} />
			</Common>
		)
	}
}
