import { View, ScrollView, Navigator, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getPano } from '../../services/index'
import { globalData } from '../../utils/config'
import './index.scss'
import Loading from '../../components/Loading'

interface ListProps {
	id: string
	cover: string
	name: string
	link: string
}

interface PanoState {
	page: number
	loading: boolean
	complete: boolean
	list: ListProps[] | null
}

class Pano extends Taro.Component {
	config = {
		navigationBarTitleText: '3D案例'
	}

	state: PanoState = {
		page: 1,
		loading: false,
		complete: false,
		list: null
	}

	componentWillMount() {
		this.getData()
	}

	scrollLower() {
		const { loading, complete } = this.state
		if (!loading && !complete) {
			this.setState(
				{
					loading: true
				},
				() => {
					this.getData()
				}
			)
		}
	}
	/**
	 * 获取列表数据
	 */
	getData() {
		const { cid } = globalData
		let { page, list, complete } = this.state
		getPano({ CompanyId: cid!, page }, res => {
			if (res.code === 0) {
				if (res.data.length) {
					page = page + 1
				} else {
					complete = true
				}
				list = list ? (list as any).concat(res.data) : res.data
			}
			this.setState({
				complete,
				page,
				list,
				loading: false
			})
		})
  }

  onShareAppMessage() {
		return {}
	}

	render() {
		const { list, loading, complete } = this.state
		return (
			<View className="pano">
				{!list ? (
					<Loading />
				) : (
					<ScrollView scrollY={true} onScrollToLower={this.scrollLower}>
						{list.length ? (
							<View className="list">
								{list.map(item => {
									return (
										<Navigator
											className="item"
											key="unique"
											url={`../pano-detail/index?link=${item.link}`}
										>
											<View className="cover">
												<Image mode="aspectFill" src={item.cover}></Image>
											</View>
											<View className="title">{item.name}</View>
										</Navigator>
									)
								})}
								{loading && <Loading tips="正在载入更多..." />}
								{complete && <View className="complete">已加载全部</View>}
							</View>
						) : (
							<View className="no-data">暂无数据</View>
						)}
					</ScrollView>
				)}
			</View>
		)
	}
}

export default Pano
