import { Component, PropsWithChildren } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface CommonProps {
	current?: number
	className?: string
}

export default class Common extends Component<PropsWithChildren<CommonProps>> {
	// 更新为新的 tabBar 页面路径
	tabList = [
		'/pages/index/index',
		'/pages/services/index',
		'/pages/orders/index',
		'/pages/profile/index'
	]

	redirect = (current: number) => {
		Taro.switchTab({ url: this.tabList[current] })
	}
	render() {
		const { className, children } = this.props
		// const current = this.props.current || 0; // 如果需要使用 current，可以取消注释

		return (
			<View className={className}>
				{children}
				{/* 注意：现在使用微信小程序原生 tabBar，不需要手动渲染
				    如果需要自定义 tabBar，可以使用以下 NutUI 组件：

				import { Tabbar, TabbarItem } from '@nutui/nutui-react-taro'

				<Tabbar
					fixed
					activeColor="#25c9f9"
					value={current}
					onSwitch={this.redirect}
				>
					<TabbarItem title="首页" icon="home" />
					<TabbarItem title="全部服务" icon="category" />
					<TabbarItem title="订单" icon="find" />
					<TabbarItem title="我的" icon="my" />
				</Tabbar>
				*/}
			</View>
		)
	}
}
