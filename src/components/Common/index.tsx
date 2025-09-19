import { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import homePng from '../../images/icon-home.png'
import homePngH from '../../images/icon-home-h.png'
import painterPng from '../../images/icon-painter.png'
import painterPngH from '../../images/icon-painter-h.png'
import pricePng from '../../images/icon-price.png'
import pricePngH from '../../images/icon-price-h.png'
import teamPng from '../../images/icon-team.png'
import teamPngH from '../../images/icon-team-h.png'
import userPng from '../../images/icon-user.png'
import userPngH from '../../images/icon-user-h.png'
import { isWeapp } from '../../utils/config'

interface CommonProps {
	current?: number
	className?: string
}

export default class Common extends Component<CommonProps, any> {
	tabList = [
		'../index/index',
		'../project/index',
		'../price-offer/index',
		'../team/index',
		'../user/index'
	]
	redirect = (current: number) => {
		Taro.switchTab({ url: this.tabList[current] })
	}
	render() {
		const { current, className, children } = this.props
		return (
			<View className={className}>
				{children}
				{isWeapp ? null : (
					<AtTabBar
						fixed
						selectedColor="#25c9f9"
						tabList={[
							{
								title: '首页',
								image: homePng,
								selectedImage: homePngH
							},
							{
								title: '工地',
								image: painterPng,
								selectedImage: painterPngH
							},
							{
								title: '报价',
								image: pricePng,
								selectedImage: pricePngH
							},
							{
								title: '团队',
								image: teamPng,
								selectedImage: teamPngH
							},
							{
								title: '我的',
								image: userPng,
								selectedImage: userPngH
							}
						]}
						onClick={this.redirect}
						current={current || 0}
					/>
				)}
			</View>
		)
	}
}
