import {
	View,
	Text,
	Navigator,
	Image,
	Button,
	Form,
	Textarea
} from '@tarojs/components'
import Taro from '@tarojs/taro'
import { addLike, addComment, getDynamicView } from '../../services/project'
import { toLogin } from '../../utils/index'
import Loading from '../../components/Loading'
import DynamicDetail from '../../components/DynamicDetail'
import './index.scss'
import { storage } from '../../utils/config'
import Gallery from '../../components/Gallery'

interface DetailProps {
	name: string
	count: string
	author: {
		headImg: string
		name: string
		title: string
	}
	dateText: string
	content: string
	images: string[]
	isLike: boolean
	likeCount: number
	like: any
	comment: any
	commentCount: number
}

interface DynamicDetailState {
	detail: DetailProps | null
	galleryShow: boolean
	galleryUrls: string[]
	galleryCurrent: number
	showComment: boolean
	pid?: string
	did?: string
	isLike: boolean
	likeCount: number
	like: any
	comment: any
	commentCount: number
}

export default class Detail extends Taro.Component {
	config = {
		navigationBarTitleText: '动态'
	}

	state: DynamicDetailState = {
		detail: null,
		isLike: false,
		likeCount: 0,
		like: [],
		comment: [],
		commentCount: 0,
		galleryShow: false,
		galleryUrls: [],
		galleryCurrent: 0,
		showComment: false
	}

	company = Taro.getStorageSync(storage.company)
	user: { userInfo: any; token: string } = Taro.getStorageSync(storage.user)

	componentWillMount() {
		const { pid, did } = this.$router.params
		const { userInfo } = this.user
		if (!userInfo) {
			toLogin()
		}
		getDynamicView(did, res => {
			const detail: DetailProps = res.data
			this.setState({
				detail,
				isLike: detail.isLike,
				likeCount: detail.likeCount,
				like: detail.like,
				comment: detail.comment,
				commentCount: detail.commentCount,
				pid,
				did
			})
		})
	}

	/**
	 * 评论
	 */
	bindFormSubmit(e) {
		const that = this
		const { pid, did, commentCount, comment } = this.state as any
		let doing = false
		const content = e.detail.value.textarea
		if (!content) {
			wx.showToast({
				icon: 'none',
				title: '请输入评论内容'
			})
			return
		}
		if (!doing) {
			doing = true
			addComment(
				{
					ProjectID: parseInt(pid, 10),
					ID: parseInt(did, 10),
					Content: content
				},
				res => {
					if (res.code === 0) {
						that.toggleComment()
						const { avatarUrl, nickName } = this.user.userInfo
						comment.unshift({
							id: res.data.id,
							content,
							createOn: res.data.createOn,
							avatarUrl,
							nickName,
							projectID: pid
						})
						that.setState({
							comment,
							commentCount: commentCount + 1
						})
					}
					doing = false
					wx.showToast({
						icon: 'none',
						title: res.message
					})
				}
			)
		}
	}

	/**
	 * 点赞
	 */
	like() {
		const that = this
		let doing = false
		const { pid, did, likeCount, like, isLike } = that.state as any
		if (!doing && !isLike) {
			doing = true
			addLike({ ID: parseInt(pid, 10), ProjectID: parseInt(did, 10) }, res => {
				if (res.code === 0) {
					const { avatarUrl, nickName } = this.user.userInfo
					like.unshift({
						id: res.data.id,
						createOn: new Date().getFullYear(),
						avatarUrl,
						nickName,
						projectID: pid
					})
					that.setState({
						likeCount: likeCount + 1,
						isLike: true,
						like
					})
				}
				wx.showToast({
					icon: 'none',
					title: res.message
				})
				doing = false
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
	 * 切换评论
	 */
	toggleComment = () => {
		const { showComment } = this.state
		this.setState({
			showComment: !showComment
		})
  }

  onShareAppMessage() {
		return {}
	}

	render() {
		const {
			detail,
			isLike,
			like,
			likeCount,
			comment,
			commentCount,
			galleryShow,
			galleryUrls,
			galleryCurrent,
			showComment,
			pid
		} = this.state
		if (!detail) {
			return <Loading />
		}
		const likes = like.slice(0, 6)
		const { userInfo } = this.user
		return (
			<View className="dynamic-detail">
				<View className="header">
					<Text className="title">{detail.name}</Text>
					<Navigator
						className="link"
						url={`../project-detail/index?pid=${pid}`}
					>
						{`查看全部${detail.count}条动态`}
						<View className="fa fa-angle-right" />
					</Navigator>
				</View>
				<View className="container">
					<View className="head">
						<View className="author">
							<Image className="avatar" src={detail.author.headImg}></Image>
							<View className="right">
								<View className="title">{detail.author.name}</View>
								<View className="sub-title">
									{detail.author.title}
									<Text className="date">{detail.dateText}</Text>
								</View>
							</View>
						</View>
						{/* <Button className="follow" size="mini">
							<View className="fa fa-heart-o" />
							关注
						</Button> */}
					</View>
					<View className="content">
						<DynamicDetail
							content={detail.content}
							images={detail.images}
							onOpegallery={this.openGallery}
						/>
						<Navigator
							className="more"
							url={`../project-detail/index?pid=${pid}`}
						>
							查看更多动态
							<View className="fa fa-angle-right" />
						</Navigator>
						<View className="info-list">
							<Navigator
								className="item"
								openType="switchTab"
								url="../team/index"
							>
								<Text>公司</Text>
								<Text className="middle">{this.company.name}</Text>
								<View className="handle">
									<Text>查看</Text>
									<View className="fa fa-angle-right" />
								</View>
							</Navigator>
							{/* <View className="item">
								<Text>粉丝</Text>
								<Text className="middle">-</Text>
								<Navigator className="handle">
									<Text>查看</Text>
									<View className="fa fa-angle-right" />
								</Navigator>
							</View> */}
						</View>
						<View className="like-area">
							<Text className="info">
								{isLike ? '感谢您的点赞' : '真诚点赞，手留余香'}
							</Text>
							<Button className={isLike ? 'liked' : ''} onClick={this.like}>
								<View className="fa fa-thumbs-o-up" />
							</Button>
							<View className="tip">
								{likeCount > 0
									? `${likeCount}人已赞`
									: '还没人有点赞，快来当第一个点赞的人吧！'}
							</View>
							{likes.length > 0 ? (
								<View className="like-list">
									{likes.map((item, index) => {
										return (
											<View
												className="item"
												style={`z-index: ${likes.length - index}`}
												key={item.id}
											>
												<Image src={item.avatarUrl} />
												{likes.length === index + 1 && (
													<View className="more">...</View>
												)}
											</View>
										)
									})}
								</View>
							) : null}
						</View>
					</View>
				</View>
				<View className="comments">
					<View className="title">
						最新评论
						{commentCount && <Text>{`(${commentCount})`}</Text>}
					</View>
					<View className="handle">
						<Image
							className="avatar"
							mode="widthFix"
							src={userInfo!.avatarUrl}
						></Image>
						<View className="input" onClick={this.toggleComment}>
							添加评论
						</View>
					</View>
					{comment.length > 0 ? (
						<View className="list">
							{comment.map(item => {
								return (
									<View className="item" key={item.id}>
										<Image
											className="avatar"
											mode="widthFix"
											src={item.avatarUrl}
										></Image>
										<View className="right">
											<View className="name">{item.nickName}</View>
											<View className="date">{item.createOn}</View>
											<View className="info">
												<Text>{item.content}</Text>
											</View>
										</View>
									</View>
								)
							})}
						</View>
					) : (
						<View className="no-data">还没人评论，快来抢占沙发吧！</View>
					)}
				</View>
				<Gallery
					show={galleryShow}
					imgUrls={galleryUrls}
					current={galleryCurrent}
					hideGallery={this.hideGallery}
				/>
				{showComment && (
					<View className="comment">
						<Form onSubmit={this.bindFormSubmit}>
							<View className="form">
								<Textarea
									value=""
									placeholder="友善的评论，是交流的起点"
									autoFocus={true}
									name="textarea"
								></Textarea>
								<Button size="mini" formType="submit">
									发送
								</Button>
							</View>
						</Form>
						<View className="mask" onClick={this.toggleComment}></View>
					</View>
				)}
			</View>
		)
	}
}
