import { View, Text, Image, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent } from 'taro-ui'
import Taro from '@tarojs/taro'
import './index.scss'
import Loading from '../../components/Loading'
import Common from '../../components/Common'
import { getCompanyTeam } from '../..//services/index'
import { globalData, storage, isWeapp } from '../../utils/config'
import PriceForm from '../../components/PriceForm'

interface TeamState {
	list: any | null
	isOpened: boolean
	company: any | null
}

class Team extends Taro.Component {
	config = {
		navigationBarTitleText: '团队'
	}

	state: TeamState = {
		list: null,
		isOpened: false,
		company: null
	}

	componentWillMount() {
		this.getData()
	}

	componentDidShow() {
		const company = Taro.getStorageSync(storage.company)
		this.setState({
			company
		})
	}

	/**
	 * 获取列表数据
	 */
	getData() {
		const that = this
		const { cid } = globalData
		getCompanyTeam(cid, res => {
			if (res.code === 0) {
				that.setState({
					list: res.data
				})
			}
		})
	}

	openModal = () => {
		this.setState({
			isOpened: true
		})
	}

	closeModal = () => {
		this.setState({
			isOpened: false
		})
	}

	onShareAppMessage() {
		return {}
	}

	render() {
		const { list, isOpened, company } = this.state
		return (
			<Common current={3}>
				<View className="team">
					{company ? (
						<View className="company">
							<View className="head">
								<View className="left">
									<View className="name">{company.name}</View>
									<View className="slogan">{company.slogan}</View>
								</View>
								<Image className="logo" src={company.logo} />
							</View>
							<View className="info-list">
								<View
									className="item"
									onClick={() => {
										Taro.makePhoneCall({ phoneNumber: company.phone })
									}}
								>
									<View className="fa fa-phone" />
									<Text className="middle">{company.phone}</Text>
									<View className="arrow fa fa-angle-right" />
								</View>
								<View className="item">
									<View className="fa fa-location-arrow" />
									<Text className="middle">{company.address}</Text>
									<View className="arrow fa fa-angle-right" />
								</View>
							</View>
						</View>
					) : null}
					{!list ? (
						<Loading />
					) : list.length ? (
						<View className="list">
							{list.map(item => {
								return (
									<View className="item" key={item.id} onClick={this.openModal}>
										<Image
											className="cover"
											src={item.headImg}
											mode="aspectFill"
											lazyLoad={isWeapp}
										/>
										<View className="right">
											<View className="head">
												<Text className="name">{item.nickName}</Text>
												<Text className="title">{item.title}</Text>
											</View>
											<View className="info">
												<Text>{item.introduction}</Text>
											</View>
											<Button className="button" size="mini">
												找TA设计
											</Button>
										</View>
									</View>
								)
							})}
						</View>
					) : (
						<View className="no-data">暂无数据</View>
					)}
					<AtModal isOpened={isOpened}>
						<AtModalHeader>预约设计师</AtModalHeader>
						<AtModalContent>
							<PriceForm source={2} closeModal={this.closeModal} />
						</AtModalContent>
					</AtModal>
				</View>
			</Common>
		)
	}
}

export default Team
