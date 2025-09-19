import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import { globalData, storage } from '../../utils/config'
import { getList } from '../../services/project'
import Loading from '../../components/Loading'
import GiftEnter from '../../components/GiftEnter'
import ProjectItem from '../../components/ProjectItem'
import Common from '../../components/Common'

interface ProjectState {
	page: number
	list: any | null
	loading: boolean
	complete: boolean
	markers: any
}

class Project extends Taro.Component {
	config = {
		navigationBarTitleText: '在建工地'
	}

	state: ProjectState = {
		page: 1,
		list: null,
		loading: false,
		complete: false,
		markers: [
			{
				id: 0,
				iconPath: '/images/map-marker.png',
				width: 0,
				height: 0,
				latitude: 23.099994,
				longitude: 113.32452,
				callout: {
					content: '中南海',
					display: 'ALWAYS',
					padding: 8,
					borderRadius: 4,
					fontSize: 12,
					color: '#fff',
					bgColor: '#000',
					borderColor: '#000',
					textAlign: 'center'
				}
			}
		]
	}

	componentWillMount() {
		this.getData()
	}

	scrollLower() {
		const that = this
		const { loading, complete } = that.state
		if (!loading && !complete) {
			that.setState(
				{
					loading: true
				},
				() => {
					that.getData()
				}
			)
		}
	}
	/**
	 * 获取列表数据
	 */
	getData() {
		const that = this
		let { page, list, complete } = that.state
		const { cid } = globalData
		getList({ page, companyId: cid }, res => {
			if (res.code === 0) {
				if (res.data.length) {
					page = page + 1
				} else {
					complete = true
				}
				list = list ? (list as any).concat(res.data) : res.data
			}
			that.setState({
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
		const salerId = Taro.getStorageSync(storage.salerId)
		return (
			<Common current={1} className="project">
				{!list ? (
					<Loading />
				) : (
					<ScrollView scrollY={true} onScrollToLower={this.scrollLower}>
						{list && list.length ? (
							<View>
								{/* <view class="filter {{className}}">
									<text>小区</text>
									<text>阶段</text>
									<text>风格</text>
									<text>智能排序</text>
								</view> */}
								<View className="list">
									{list.map(item => (
										<ProjectItem
											key={item.id}
											item={item}
											userId={salerId ? parseInt(salerId, 10) : item.salerId}
										/>
									))}
									{loading && <Loading />}
									{complete && <View className="complete">已加载全部</View>}
								</View>
							</View>
						) : (
							<View className="no-data">暂无数据</View>
						)}
					</ScrollView>
				)}
				<GiftEnter />
			</Common>
		)
	}
}

export default Project
