import { WebView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Loading from '../../components/Loading'

class PanoDetail extends Taro.Component {
	onShareAppMessage() {
		return {}
  }

	render() {
		const { link } = this.$router.params
		return link ? <WebView src={link} /> : <Loading />
	}
}

export default PanoDetail
