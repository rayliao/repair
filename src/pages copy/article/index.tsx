import { View, ScrollView, Navigator, Image } from '@tarojs/components'
import { Component } from '@tarojs/taro'
import Loading from '../../components/Loading'
import styles from './index.module.scss'
import { globalData } from '../../utils/config'
import { getArticleList } from '../../services/article'

interface ListProps {
	id: string
	cover: string
	title: string
}

interface ArticleState {
	page: number
	loading: boolean
	complete: boolean
	list: ListProps[] | null
}

export default class Article extends Component {
	config = {
		navigationBarTitleText: '家装知识'
	}
	state: ArticleState = {
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
		getArticleList({ CompanyId: cid!, page, category: 2 }, res => {
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
      <View className={styles.main}>
				{list ? (
					<ScrollView scrollY={true} onScrollToLower={this.scrollLower}>
						{list.length ? (
							<View className={styles.list}>
								{list.map((item, index) => {
									return (
										<Navigator
											className={styles.listItem}
											key={index}
											url={`../article-detail/index?aid=${item.id}`}
										>
											<View className={styles.listCover}>
												<Image mode="aspectFill" src={item.cover}></Image>
											</View>
											<View className={styles.listTitle}>{item.title}</View>
										</Navigator>
									)
								})}
								{loading && <Loading tips="正在载入更多..." />}
								{complete && (
									<View className={styles.complete}>已加载全部</View>
								)}
							</View>
						) : (
							<View className={styles.noData}>暂无数据</View>
						)}
					</ScrollView>
				) : (
					<Loading />
				)}
			</View>
		)
	}
}
