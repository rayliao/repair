import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Navigator } from '@tarojs/components'
import { getArticleDetail } from '../../services/article'
import styles from './index.module.scss'
import Loading from '../../components/Loading'
import ParserRichText from '../../components/ParserRichText/parserRichText'
import { storage } from '../../utils/config'

interface DetailProps {
	cover: string
	title: string
	dateText: string
	content: string
	author: { headImg: string; name: string; title: string }
}

interface ArticleDetailState {
	detail: DetailProps | null
}

export default class ArticleDetail extends Component {
	/**
	 * 指定config的类型声明为: Taro.Config
	 *
	 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
	 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
	 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
	 */
	config: Config = {
		navigationBarTitleText: '家装知识'
	}

	state: ArticleDetailState = {
		detail: null
	}

	company = Taro.getStorageSync(storage.company)

	componentWillMount() {
		const { aid } = this.$router.params
		getArticleDetail(aid, res => {
			if (res.code === 0) {
				this.setState({
					detail: res.data
				})
				Taro.setNavigationBarTitle({
					title: res.data.title
				})
			}
		})
  }

  onShareAppMessage() {
		return {}
	}

	render() {
		const { detail } = this.state
		return (
			<View className={styles.main}>
				{detail ? (
					<View>
						<Image
							className={styles.cover}
							mode="widthFix"
							src={detail.cover}
						/>
						<View className={styles.header}>
							<Text className={styles.headerTitle}></Text>
							<View className={styles.basic}>
								<View className={styles.basicAuthor}>
									<Image
										className={styles.basicAvatar}
										src={detail.author.headImg}
									></Image>
									<View className="right">
										<View className={styles.basicTitle}>
											{detail.author.name}
										</View>
										<View className={styles.basicSubTitle}>
											{detail.author.title}
											<Text className={styles.basicDate}>
												{detail.dateText}
											</Text>
										</View>
									</View>
								</View>
								{/* <Button className={styles.basicFollow} size="mini">
									<View className={`fa fa-heart-o ${styles.basicFollowFa}`} />
									关注
								</Button> */}
							</View>
							<View className="info-list">
								<Navigator
									className={styles.infolistItem}
									url="../team/index"
									openType="switchTab"
								>
									<Text>公司</Text>
									<Text className={styles.infolistItemMiddle}>
										{this.company.name}
									</Text>
									<View className={styles.infolistItemHandle}>
										<Text>查看</Text>
										<View
											className={`fa fa-angle-right ${styles.infolistItemHandleFa}`}
										/>
									</View>
								</Navigator>
							</View>
						</View>
						<View className={styles.content}>
							<View className={styles.contentTitle}>知识描述：</View>
							<ParserRichText html={detail.content} />
						</View>
					</View>
				) : (
					<Loading />
				)}
			</View>
		)
	}
}
