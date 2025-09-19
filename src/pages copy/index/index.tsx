import { Component, Config } from '@tarojs/taro'
import {
	Block,
	View,
	Image,
	Text,
	Button,
	Swiper,
	SwiperItem,
	Navigator,
	ScrollView
} from '@tarojs/components'
import Loading from '../../components/Loading'
import PriceForm from '../../components/PriceForm'
import PriceSlick from '../../components/PriceSlick'
import GiftEnter from '../../components/GiftEnter'
import Common from '../../components/Common'
import { getPano, getCompanyTeam } from '../../services/index'
import { getList } from '../../services/project'
import { getArticleList, getWheel } from '../../services/article'
import { globalData, storage, isWeapp } from '../../utils/config'
import { saveCompany } from '../../utils/index'
import styles from './index.module.scss'
import { AtTabBar } from 'taro-ui'
import homePng from '../../images/icon-home.png'

interface CompanyProps {
	logo: string
	name: string
}

interface IndexState {
	page: number
	wheel: any
	list: any
	caseList: any
	articleList: any
	company: CompanyProps | null
	quote: Object[]
	team: any
	pano: any
}

export default class Index extends Component<any, IndexState> {
	/**
	 * 指定config的类型声明为: Taro.Config
	 *
	 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
	 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
	 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
	 */
	config: Config = {
		navigationBarTitleText: '小精灵装饰'
	}
	state: IndexState = {
		page: 1,
		wheel: null,
		list: null,
		caseList: null,
		articleList: null,
		company: null,
		quote: [],
		team: null,
		pano: null
	}
	componentWillMount() {
		const { cid } = globalData
		const company = Taro.getStorageSync(storage.company)
		if (!company) {
			saveCompany(cid)
		}
		this.getData()
		getWheel(cid!, res => {
			if (res.code === 0) {
				this.setState({ wheel: res.data })
			}
		})
		getArticleList({ CompanyId: cid!, category: 1, page: 1 }, res => {
			if (res.code === 0) {
				this.setState({
					caseList: res.data.slice(0, 5)
				})
			}
		})
		getCompanyTeam(cid, res => {
			if (res.code === 0) {
				this.setState({
					team: res.data
				})
			}
		})
		getArticleList({ CompanyId: cid!, category: 2, page: 1 }, res => {
			if (res.code === 0) {
				this.setState({
					articleList: res.data.slice(0, 8)
				})
			}
		})
		getPano({ CompanyId: cid!, page: 1 }, res => {
			if (res.code === 0) {
				this.setState({
					pano: res.data
				})
			}
		})
	}
	componentDidShow() {
		const company = Taro.getStorageSync(storage.company)
		this.setState({
			company
		})
	}
	getData() {
		getList({ page: 1, companyId: globalData.cid }, res => {
			this.setState({
				list: res.data.slice(0, 6)
			})
		})
	}
	/**
	 * 轮播图链接
	 */
	swiperLink = item => {
		Taro.navigateTo({
			url: `/pages/${item.type === 1 ? 'case' : 'article'}-detail/index?aid=${
				item.id
			}`
		})
	}
	onShareAppMessage() {
		return {}
	}

	render() {
		const {
			wheel,
			company,
			caseList,
			list,
			team,
			pano,
			articleList
		} = this.state
		return (
			<Common className={styles.container}>
				<View className={styles.header}>
					{company ? (
						<View className={styles.company}>
							<View className={styles.companyLeft}>
								{company.logo !== null && (
									<Image
										src={company.logo}
										className={styles.companyLogo}
									></Image>
								)}
								<Text className={styles.headerTitle}>{company.name}</Text>
							</View>
							<Navigator
								className={styles.companyAsk}
								url="../team/index"
								openType="switchTab"
							>
								咨询
							</Navigator>
						</View>
					) : null}
					{wheel ? (
						<Swiper
							className={styles.slick}
							previousMargin="20px"
							nextMargin="20px"
							autoplay
						>
							{wheel.map((item, index) => {
								return (
									<Block key={index}>
										<SwiperItem
											onClick={this.swiperLink.bind(this, item)}
											data-id={item.id}
											className={styles.slickItem}
										>
											<Image
												className={styles.slickCover}
												mode="aspectFill"
												src={item.cover}
											></Image>
											<Text className={styles.slickTitle}>{item.title}</Text>
										</SwiperItem>
									</Block>
								)
							})}
						</Swiper>
					) : (
						<Loading />
					)}
					<View className={styles.menu}>
						<View className={styles.menuItem}>
							<Navigator url="/pages/project/index" openType="switchTab">
								<View className={`fa fa-leaf ${styles.menuFa}`} />
								<Text className={styles.menuText}>在建工地</Text>
							</Navigator>
						</View>
						<View className={styles.menuItem}>
							<Navigator url="../case/index">
								<View className={`fa fa-rocket ${styles.menuFa}`} />
								<Text className={styles.menuText}>经典案例</Text>
							</Navigator>
						</View>
						<View className={styles.menuItem}>
							<Navigator url="/pages/team/index" openType="switchTab">
								<View className={`fa fa-users ${styles.menuFa}`} />
								<Text className={styles.menuText}>设计团队</Text>
							</Navigator>
						</View>
						<View className={styles.menuItem}>
							<Navigator url="../pano/index">
								<View className={`fa fa-camera ${styles.menuFa}`} />
								<Text className={styles.menuText}>360全景</Text>
							</Navigator>
						</View>
					</View>
					<View className={styles.price}>
						<View className={styles.priceTitle}>我家维修需要多少钱？</View>
						<View className={styles.priceSubtitle}>仅需10秒快速报价</View>
						<PriceForm source={1} isIndex />
						<PriceSlick />
					</View>
				</View>
				<View className={styles.case}>
					<View className={styles.caseHead}>
						<Text className={styles.caseTitle}>家装案例</Text>
						{/* <Navigator url="../case/index" className={styles.caseMore}>
							更多 +
						</Navigator> */}
					</View>
					{caseList ? (
						<Block>
							{caseList.length >= 3 ? (
								<Block>
									<View className={styles.caseTop}>
										<Navigator
											url={`../case-detail/index?aid=${caseList[0].id}`}
										>
											<Image
												mode="aspectFill"
												className={`${styles.caseCover} ${styles.caseTopCover}`}
												src={caseList[0].cover}
											></Image>
											<View
												className={`${styles.caseInfo} ${styles.caseTopInfo}`}
											>
												<Text className={styles.caseItemTitle}>
													{caseList[0].title}
												</Text>
											</View>
										</Navigator>
									</View>
									<View className={styles.caseBottom}>
										<View className={styles.caseBottomItem}>
											<Navigator
												url={`../case-detail/index?aid=${caseList[1].id}`}
											>
												<Image
													mode="aspectFill"
													className={`${styles.caseCover} ${styles.caseBottomCover}`}
													src={caseList[1].cover}
												></Image>
												<View
													className={`${styles.caseInfo} ${styles.caseBottomInfo}`}
												>
													<Text className={styles.caseItemTitle}>
														{caseList[1].title}
													</Text>
												</View>
											</Navigator>
										</View>
										<View className={styles.caseBottomItem}>
											<Navigator
												url={`../case-detail/index?aid=${caseList[2].id}`}
											>
												<Image
													mode="aspectFill"
													className={`${styles.caseCover} ${styles.caseBottomCover}`}
													src={caseList[2].cover}
												></Image>
												<View
													className={`${styles.caseInfo} ${styles.caseBottomInfo}`}
												>
													<Text className={styles.caseItemTitle}>
														{caseList[2].title}
													</Text>
												</View>
											</Navigator>
										</View>
									</View>
								</Block>
							) : (
								<View className={styles.noData}>暂无数据</View>
							)}
							<View className={styles.panoMore}>
								<Navigator url="../case/index">
									更多家装案例
									<View className="fa fa-angle-double-right" />
								</Navigator>
							</View>
						</Block>
					) : (
						<Loading />
					)}
				</View>
				<View className={styles.project}>
					<View className={styles.projectHead}>
						<Text className={styles.caseTitle}>在建工地</Text>
					</View>
					{list ? (
						<Block>
							{list.length > 0 ? (
								<View className={styles.projectlist}>
									{list.map((item, index) => {
										return (
											<View className={styles.projectlistItem} key={index}>
												<Navigator
													url={'../project-detail/index?pid=' + item.id}
												>
													<Image
														className={styles.projectlistCover}
														mode="aspectFill"
														src={item.cover}
													></Image>
													<Text className={styles.projectlistName}>
														{item.name}
													</Text>
												</Navigator>
											</View>
										)
									})}
								</View>
							) : (
								<View className={styles.noData}>暂无数据</View>
							)}
							<View className={styles.panoMore}>
								<Navigator url="/pages/project/index" openType="switchTab">
									更多在建工地
									<View className="fa fa-angle-double-right" />
								</Navigator>
							</View>
						</Block>
					) : (
						<Loading />
					)}
				</View>
				<View className={styles.team}>
					<View className={styles.teamHead}>
						设计团队
						<Text className={styles.teamTip}>
							\数千位行内资深设计师、搭配师
						</Text>
					</View>
					{team ? (
						<Block>
							{team.length > 0 ? (
								<ScrollView scrollX={true}>
									<View className={styles.teamList}>
										{team.map(item => {
											return (
												<View key={item.id} className={styles.teamItem}>
													<Image
														className={styles.teamAvatar}
														src={item.headImg}
													></Image>
													<View className={styles.teamName}>
														{item.nickName}
													</View>
													<View className={styles.teamSubtitle}>
														{item.title}
													</View>
												</View>
											)
										})}
									</View>
								</ScrollView>
							) : (
								<View className={styles.noData}>暂无数据</View>
							)}
							<View className={styles.teamMore}>
								<Navigator url="/pages/team/index" openType="switchTab">
									更多设计师
									<View className="fa fa-angle-double-right" />
								</Navigator>
							</View>
						</Block>
					) : (
						<Loading />
					)}
				</View>
				<View className={styles.pano}>
					<View className={styles.panoHead}>
						3D实景图
						<Text className={styles.panoTip}>
							\裸眼3D给您带来一样的维修之旅
						</Text>
					</View>
					{pano ? (
						<Block>
							{pano.length >= 3 ? (
								<Block>
									<View className={styles.panoTop}>
										<Navigator
											url={`../pano-detail/index?link=${pano[0].link}`}
										>
											<Image
												className={`${styles.panoCover} ${styles.panoTopCover}`}
												mode="aspectFill"
												src={pano[0].cover}
											></Image>
											<View
												className={`${styles.panoInfo} ${styles.panoTopInfo}`}
											>
												<Text className={styles.panoItemTitle}>
													{pano[0].name}
												</Text>
											</View>
										</Navigator>
									</View>
									<View className={styles.panoBottom}>
										<View className={styles.panoBottomItem}>
											<Navigator
												url={'../pano-detail/index?link=' + pano[1].link}
											>
												<Image
													className={`${styles.panoCover} ${styles.panoBottomCover}`}
													mode="aspectFill"
													src={pano[1].cover}
												></Image>
												<View
													className={`${styles.panoInfo} ${styles.panoBottomInfo}`}
												>
													<Text className={styles.panoItemTitle}>
														{pano[1].name}
													</Text>
												</View>
											</Navigator>
										</View>
										<View className={styles.panoBottomItem}>
											<Navigator
												url={'../pano-detail/index?link=' + pano[2].link}
											>
												<Image
													className={`${styles.panoCover} ${styles.panoBottomCover}`}
													mode="aspectFill"
													src={pano[2].cover}
												></Image>
												<View
													className={`${styles.panoInfo} ${styles.panoBottomInfo}`}
												>
													<Text className={styles.panoItemTitle}>
														{pano[2].name}
													</Text>
												</View>
											</Navigator>
										</View>
									</View>
								</Block>
							) : (
								<View className={styles.noData}>暂无数据</View>
							)}
							<View className={styles.panoMore}>
								<Navigator url="../pano/index">
									更多3D案例
									<View className="fa fa-angle-double-right" />
								</Navigator>
							</View>
						</Block>
					) : (
						<Loading />
					)}
				</View>
				<View className={styles.article}>
					<View className={styles.articleHead}>
						家装知识
						<Text className={styles.articleTip}>
							\明明白白掌握家装从家装课堂开始
						</Text>
					</View>
					{articleList ? (
						<Block>
							{articleList.length ? (
								<View className={styles.articleList}>
									{articleList.map(item => (
										<Navigator
											key={item.id}
											url={`../article-detail/index?aid=${item.id}`}
											className={styles.articleItem}
										>
											<Image
												className={styles.articleCover}
												mode="aspectFill"
												src={item.cover}
												lazyLoad={isWeapp}
											></Image>
											<View className={styles.articleRight}>
												<View className={styles.articleTitle}>
													{item.title}
												</View>
												<Button className={styles.articleBtn} size="mini">
													查看全部
												</Button>
											</View>
										</Navigator>
									))}
								</View>
							) : (
								<View className={styles.noData}>暂无数据</View>
							)}
							<View className={styles.articleMore}>
								<Navigator url="../article/index">
									更多家装知识
									<View className="fa fa-angle-double-right" />
								</Navigator>
							</View>
						</Block>
					) : (
						<Loading />
					)}
				</View>
				<GiftEnter />
			</Common>
		)
	}
}
