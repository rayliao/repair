import Taro from '@tarojs/taro'
import Price from '../../components/Price'

class PriceGet extends Taro.Component {
	config = {
		navigationBarTitleText: '维修报价'
	}

	onShareAppMessage() {
		return {}
	}

	render() {
		const { s } = this.$router.params
		return <Price source={parseInt(s, 10)} />
	}
}

export default PriceGet
