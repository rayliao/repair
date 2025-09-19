import Taro, { Component } from '@tarojs/taro'
import { View, Navigator, Text, Button } from '@tarojs/components'
import './index.scss'

interface FooterProps {
	share?: boolean
	openSheet?: () => void
}

export default class Footer extends Component<FooterProps, any> {
	static options = {
		addGlobalClass: true
	}
	/**
	 * 跳转到报价页
	 */
	toPrice(e) {
		Taro.navigateTo({
			url: `../price-get/index?s=${e.target.dataset.s}`
		})
	}

	render() {
		const { share, openSheet } = this.props

		return (
			<View className="comp-footer">
				<View className="left">
					<Navigator className="item" url="../index/index" openType="switchTab">
						<View className="fa fa-home" />
						<Text>首页</Text>
					</Navigator>
					{share ? (
						<Button className="btn item" size="mini" onClick={openSheet} plain>
							<View className="fa fa-share-square-o" />
							<Text>分享</Text>
						</Button>
					) : (
						<Button className="btn item" size="mini" openType="share" plain>
							<View className="fa fa-share-square-o" />
							<Text>分享</Text>
						</Button>
					)}
				</View>
				<View className="right">
					<View className="item">
						<Button onClick={this.toPrice} data-s="2" className="btn btn-book">
							预约本案设计师
						</Button>
					</View>
					<View className="item">
						<Button onClick={this.toPrice} data-s="1" className="btn btn-ask">
							获取本案报价
						</Button>
					</View>
				</View>
			</View>
		)
	}
}
