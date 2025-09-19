import {
	View,
	Image,
	Text,
	Navigator,
	Button,
	Block,
	Canvas
} from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import { setGlobalData, storage, isWeapp } from '../../utils/config'
import {
	checkLogin,
	toLogin,
	saveCompany,
	base64ToSrc
} from '../../utils/index'
import { AtActionSheet, AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import {
	getDetail,
	getDynamic,
	addLike,
	getUnlimited
} from '../../services/project'
import { gzhGetSignature } from '../../services/web'
import Loading from '../../components/Loading'
import DynamicDetail from '../../components/DynamicDetail'
import Gallery from '../../components/Gallery'
import Footer from '../../components/Footer'
import banner from './banner.jpg'
import GiftEnter from '../../components/GiftEnter'
const wx = isWeapp ? null : require('weixin-js-sdk')

interface ProjectDetailState {
	info: any | null
	list: any
	isLikeList: boolean[]
	likeCountList: number[]
	step: string[]
	galleryShow: boolean
	galleryUrls: string[]
	galleryCurrent: number
	company: any | null
	hideGallery?: boolean
	showModal: boolean
	isOpened: boolean
	shareImg: string
	qrCode: string
}

interface Options {
	cid: string
	sid: string
	pid: string
}

class ProjectDetail extends Taro.Component {
	state: ProjectDetailState = {
		info: null,
		list: null,
		isLikeList: [],
		likeCountList: [],
		step: [
			'前期',
			'设计',
			'拆改',
			'墙固',
			'放样',
			'水电',
			'泥木',
			'油漆',
			'软装',
			'入住'
		],
		galleryShow: false,
		galleryUrls: [],
		galleryCurrent: 0,
		isOpened: false,
		showModal: false,
		shareImg: '',
		qrCode: '',
		company: Taro.getStorageSync(storage.company)
	}

	componentWillMount() {
		const that = this
		const { q = '', cid, sid, pid } = this.$router.params
		let options: Options = {
			cid,
			sid,
			pid
		}
		let scene = this.$router.params.scene
		if (scene) {
			scene = decodeURIComponent(scene.toString())
			options = {
				...options,
				...this.splitParams(scene)
			}
		}
		const path = decodeURIComponent(q).replace(/http[s]?:\/\/[^/?]+/, '')
		if (path) {
			options = {
				...options,
				...this.splitParams(path)
			}
		}
		if (options.cid) {
			const intCid = parseInt(options.cid, 10)
			setGlobalData('cid', intCid)
			saveCompany(intCid, data => {
				that.setState({
					company: data
				})
			})
		} else {
			options.cid = this.state.company.id
		}
		if (options.sid) {
			Taro.setStorageSync(storage.salerId, options.sid)
		}
		let salerId = Taro.getStorageSync(storage.salerId)
		salerId = salerId ? parseInt(salerId, 10) : 0
		getDetail({ id: parseInt(options.pid, 10), salerId }, res => {
			if (res.code === 0) {
				that.setState({
					info: res.data
				})
				Taro.setNavigationBarTitle({
					title: res.data.name
				})
			}
		})

		getDynamic({ id: parseInt(options.pid) }, res => {
			if (res.code === 0) {
				let isLikeList: any = []
				let likeCountList: any = []
				res.data.forEach((item: { isLike: boolean; likeCount: number }) => {
					isLikeList.push(item.isLike)
					likeCountList.push(item.likeCount)
				})
				that.setState({
					isLikeList,
					likeCountList,
					list: res.data
				})
			}
		})

		const user = Taro.getStorageSync(storage.user)

		getUnlimited(
			{
				pid: options.pid,
				cid: options.cid,
				sid:
					user.companyId === options.cid &&
					user.userId &&
					parseInt(user.userId, 10) !== 0
						? user.userId
						: salerId
			},
			(res: { code: number; base64: string }) => {
				if (res.code === 0) {
					this.setState({
						qrCode: res.base64
					})
				}
			}
		)
		if (!isWeapp) {
			gzhGetSignature(
				{
					url: document.location.href.split('#')[0],
					dev: process.env.NODE_ENV === 'development' ? 1 : 0
				},
				(res: {
					code: number
					data: {
						appid: string
						timestamp: string
						noncestr: string
						signature: string
					}
				}) => {
					if (res.code === 0) {
						wx.config({
							appId: res.data.appid,
							timestamp: res.data.timestamp,
							nonceStr: res.data.noncestr,
							signature: res.data.signature,
							jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData']
						})
					}
				}
			)
		}
	}

	componentDidShow() {
		const company = Taro.getStorageSync(storage.company)
		this.setState({
			company
		})
	}

	/**
	 * 拆分参数
	 */
	splitParams = (path: string) => {
		const ops = {}
		const arr = path.split('?')
		const query = arr[arr.length === 1 ? 0 : 1]
		const params = query.split('&')
		if (params.length) {
			params.forEach(item => {
				const arr = item.split('=')
				ops[arr[0]] = arr[1]
			})
		}
		return ops
	}

	/**
	 * 点赞
	 */
	like = (index, id) => {
		const that = this
		let doing = false
		const { info, isLikeList, likeCountList } = that.state
		if (!isLikeList[index] && !doing) {
			doing = true
			checkLogin(() => {
				addLike(
					{ ID: parseInt(id, 10), ProjectID: parseInt(info.id, 10) },
					res => {
						if (res.code === 0) {
							isLikeList[index] = true
							likeCountList[index] += 1
							that.setState({
								isLikeList,
								likeCountList
							})
						} else if (res.code === 1) {
							toLogin()
						}
						Taro.showToast({
							icon: 'none',
							title: res.message
						})
						doing = false
					}
				)
			})
		}
	}

	/**
	 * 打开动态图像列表
	 */
	openGallery = (index, urls) => {
		if (!this.state.galleryShow) {
			this.setState({
				galleryShow: true,
				galleryCurrent: index,
				galleryUrls: urls
			})
		}
	}

	/**
	 * 隐藏动态图像列表
	 */
	hideGallery = () => {
		if (this.state.galleryShow) {
			this.setState({
				galleryShow: false
			})
		}
	}

	/**
	 * 转发
	 */
	onShareAppMessage(res) {
		const { info, company } = this.state
		if (res && info) {
			const salerId = Taro.getStorageSync(storage.salerId)
			const user = Taro.getStorageSync(storage.user)
			const sid =
				user.companyId === company.id &&
				user.userId &&
				parseInt(user.userId, 10) !== 0
					? user.userId
					: salerId
			const { did } = res.target.dataset
			let path = `pages/project-detail/index?pid=${info.id}&sid=${sid}&cid=${company.id}`
			if (did) {
				path = `pages/dynamic-detail/index?pid=${info.id}&did=${did}`
			}
			return {
				path
			}
		}
		return {}
	}

	openSheet = () => {
		this.setState({
			isOpened: true
		})
	}

	/**
	 * 海报生成
	 */
	shareFriends = async () => {
		Taro.showLoading({
			title: '海报生成中'
		})
		const { qrCode, info } = this.state
		Taro.getImageInfo({
			src: info.cover,
			success: res => {
				base64ToSrc(`data:image/jpeg;base64,${qrCode}`).then((path: string) =>
					this.createCode(res.path, path)
				)
			},
			fail: res =>
				Taro.showToast({
					icon: 'none',
					title: res.errMsg
				})
		})
	}

	toTempFile = () => {
		Taro.canvasToTempFilePath({
			x: 0,
			y: 0,
			canvasId: 'shareFriends',
			success: res => {
				let shareImg = res.tempFilePath
				this.setState({
					showModal: true,
					isOpened: false,
					shareImg
				})
				Taro.hideLoading()
			}
		})
	}

	/**
	 * 生成画布
	 */
	createCode = (cover: string, path: string) => {
		const { info, company } = this.state
		const { name } = info
		const ctx = Taro.createCanvasContext('shareFriends')
		ctx.setFillStyle('#fff')
		ctx.fillRect(0, 0, 280, 440)
		ctx.drawImage(cover, 0, 0, 280, 140)
		ctx.font = 'normal bold 16px sans-serif'
		ctx.setTextAlign('left')
		ctx.setFillStyle('#333')
		ctx.fillText(name, 15, 180)
		ctx.font = 'normal normal 14px sans-serif'
		ctx.fillText(
			`${info.houseType}/${info.size}/${info.style}/${info.decoration}/${info.budget}`,
			15,
			210
		)
		ctx.fillText(info.address, 15, 230)
		// ctx.arc(36, 268, 20, 0, 2 * Math.PI)
		// ctx.clip()
		ctx.drawImage(path, 15, 270, 80, 80)
		ctx.setFillStyle('#999')
		ctx.fillText('长按扫码查看详情', 105, 305)
		ctx.fillText(`分享自「${company.name}」`, 105, 330)
		ctx.setFillStyle('#f7f7f7')
		ctx.fillRect(0, 390, 280, 50)
		ctx.setFillStyle('#333')
		ctx.setTextAlign('center')
		ctx.fillText('客户满意是我们的最高目标', 140, 422)
		ctx.draw(false, () => {
			this.toTempFile()
		})
	}

	cancelModal = () => {
		this.setState({
			showModal: false
		})
	}

	confirmModal = () => {
		const self = this
		Taro.getSetting({
			success(res) {
				if (res.authSetting['scope.writePhotosAlbum']) {
					self.saveImg()
				} else {
					Taro.authorize({
						scope: 'scope.writePhotosAlbum',
						success() {
							self.saveImg()
						}
					})
				}
			}
		})
	}

	/**
	 * 保存图片
	 */
	saveImg = () => {
		const self = this
		const { shareImg } = self.state
		Taro.saveImageToPhotosAlbum({
			filePath: shareImg,
			success() {
				Taro.showToast({
					title: '保存成功'
				})
				self.setState({
					showModal: false
				})
			},
			fail() {
				Taro.showToast({
					title: '保存失败',
					icon: 'none'
				})
			}
		})
	}

	render() {
		const {
			info,
			list,
			isLikeList,
			likeCountList,
			galleryShow,
			galleryUrls,
			galleryCurrent,
			company,
			isOpened,
			showModal,
			shareImg
		} = this.state
		return (
			<View className="project-detail">
				{!info ? (
					<Loading />
				) : (
					<View>
						<Image className="cover" mode="aspectFill" src={info.cover}></Image>
						<View className="header">
							<Text className="title">{info.name}</Text>
							<View className="basic-area">
								<View className="item">
									<Text className="tip">户型</Text>
									<Text className="text">{info.houseType}</Text>
								</View>
								<View className="item">
									<Text className="tip">面积</Text>
									<Text className="text">{info.size}</Text>
								</View>
								<View className="item">
									<Text className="tip">风格</Text>
									<Text className="text">{info.style}</Text>
								</View>
								<View className="item">
									<Text className="tip">装修方式</Text>
									<Text className="text">{info.decoration}</Text>
								</View>
							</View>
							<View className="info-list">
								<View className="item">
									<Text>预算</Text>
									<Text className="middle">{info.budget}</Text>
								</View>
								<View className="item">
									<Text>小区</Text>
									<Text className="middle">{info.address}</Text>
									<Navigator className="handle" url="../project/index">
										<Text>查看</Text>
										<View className="fa fa-angle-right" />
									</Navigator>
								</View>
								<Navigator
									className="item"
									openType="switchTab"
									url="../team/index"
								>
									<Text>公司</Text>
									<Text className="middle">{company ? company.name : '-'}</Text>
									<View className="handle">
										<Text>查看</Text>
										<View className="fa fa-angle-right" />
									</View>
								</Navigator>
							</View>
						</View>
					</View>
				)}
				<View className="content">
					{list ? (
						<View className="main">
							{list && list.length > 0 ? (
								<View>
									<View className="head">
										<View className="title">
											<Text className="text">装修动态</Text>
											<Text className="total">{`共${list.length}条`}</Text>
										</View>
									</View>
									{list.map((term, index) => (
										<Block key={term.id}>
											<View className="item">
												<Image
													className="avatar"
													mode="widthFix"
													src={term.author.headImg}
													lazyLoad={isWeapp}
												></Image>
												<View className="right">
													<Text className="subtitle">{term.author.name}</Text>
													<Text className="nick">{term.author.title}</Text>
													<DynamicDetail
														content={term.content}
														images={term.images}
														onOpegallery={this.openGallery}
													/>
													<Text className="date">{term.createOn}</Text>
													<View className="handle">
														<View
															className={`btn ${
																isLikeList[index] ? 'btn-select' : ''
															}`}
															onClick={this.like.bind(this, index, term.id)}
														>
															<View className="fa fa-thumbs-o-up" />
															{likeCountList[index]}
														</View>
														<View className="btn">
															<Navigator
																url={`../dynamic-detail/index?pid=${info.id}&did=${term.id}`}
															>
																<View className="fa fa-comment-o" />
																评论
															</Navigator>
														</View>
														<View
															className={`btn ${
																term.isCollect ? 'btn-select' : ''
															}`}
															data-index={index}
															data-id={term.id}
														>
															<View className="fa fa-heart-o" />
															收藏
														</View>
														{isWeapp ? (
															<Button
																className="btn"
																openType="share"
																data-did={term.id}
																plain={true}
															>
																<View className="fa fa-share-square-o" />
																分享
															</Button>
														) : (
															<View className="btn" />
														)}
													</View>
													{term.comment.length > 0 && (
														<View className="comments">
															{term.comment.map(comentItem => {
																return (
																	<View className="row" key={comentItem.id}>
																		<Text>{`${comentItem.nickName}：`}</Text>
																		<Text>{comentItem.content}</Text>
																	</View>
																)
															})}
															<View className="arrow"></View>
														</View>
													)}
												</View>
											</View>
											{index !== 0 && index % 4 === 0 && (
												<Navigator url="../price-get/index?s=3">
													<Image
														className="banner"
														mode="aspectFill"
														src={banner}
													/>
												</Navigator>
											)}
										</Block>
									))}
								</View>
							) : (
								<View className="no-data">
									<Text>暂无数据</Text>
								</View>
							)}
						</View>
					) : (
						<Loading />
					)}
					<Gallery
						show={galleryShow}
						imgUrls={galleryUrls}
						current={galleryCurrent}
						hideGallery={this.hideGallery}
					/>
				</View>
				<Footer share={true} openSheet={this.openSheet} />
				<GiftEnter />
				<AtActionSheet isOpened={isOpened}>
					<View className="sheet">
						{isWeapp ? (
							<Block>
								<Button className="btn" openType="share">
									<View className="icon-wrap icon-weixin">
										<View className="fa fa-weixin" />
									</View>
									<Text className="text">微信好友</Text>
								</Button>
								<Button className="btn" onClick={this.shareFriends}>
									<View className="icon-wrap">
										<View className="fa fa-image" />
									</View>
									<Text className="text">生成海报</Text>
								</Button>
							</Block>
						) : (
              <Block>
							<Button
								className="btn"
								onClick={() => {
									wx.ready(() => {
										wx.updateTimelineShareData({
											title: info.name,
											link: document.location.href,
											imgUrl: info.cover,
											success: () => {
												Taro.showModal({
													title: '提示',
													content: '点击右上角选择分享到朋友圈',
													confirmText: '好的'
												})
											}
										})
									})
								}}
							>
								<View className="icon-wrap icon-chrome">
									<View className="fa fa-chrome" />
								</View>
								<Text className="text">分享朋友圈</Text>
							</Button>
              <Button
								className="btn"
								onClick={() => {
									wx.ready(() => {
										wx.updateAppMessageShareData({
											title: info.name,
											link: document.location.href,
											imgUrl: info.cover,
											success: () => {
												Taro.showModal({
													title: '提示',
													content: '点击右上角选择分享给朋友',
													confirmText: '好的'
												})
											}
										})
									})
								}}
							>
								<View className="icon-wrap icon-weixin">
									<View className="fa fa-weixin" />
								</View>
								<Text className="text">分享给朋友</Text>
							</Button>
              </Block>
						)}
					</View>
				</AtActionSheet>
				<AtModal isOpened={showModal}>
					<AtModalContent>
						<Image style={{ width: '100%' }} mode="widthFix" src={shareImg} />
					</AtModalContent>
					<AtModalAction>
						<Button onClick={this.cancelModal}>取消</Button>
						<Button onClick={this.confirmModal}>保存到相册</Button>
					</AtModalAction>
				</AtModal>
				<Canvas
					style={{
						width: '280px',
						height: '480px',
						position: 'fixed',
						top: '-10000px'
					}}
					canvasId="shareFriends"
				/>
			</View>
		)
	}
}

export default ProjectDetail
