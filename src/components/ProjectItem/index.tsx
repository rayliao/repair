import Taro, { Component } from '@tarojs/taro'
import { Navigator, View, Image, Text } from '@tarojs/components'
import { isWeapp } from '../../utils/config'
import styles from './index.module.scss'

interface ProjectItemProps {
	item: {
		id: number
		cover: string
		name: string
		companyID: number
	}
	userId?: number
	openType?:
		| 'navigate'
		| 'redirect'
		| 'switchTab'
		| 'reLaunch'
		| 'navigateBack'
		| 'exit'
		| undefined
}

class ProjectItem extends Component<ProjectItemProps, any> {
	render() {
		const { item, openType, userId } = this.props
		return (
			<Navigator
				className={styles.item}
				key="unique"
				openType={openType || 'navigate'}
				url={`../project-detail/index?pid=${item.id}&cid=${item.companyID}${
					userId ? `&sid=${userId}` : ''
				}`}
			>
				<View className={styles.left}>
					<Image
						className={styles.cover}
						src={item.cover}
						mode="aspectFill"
						lazyLoad={isWeapp}
					/>
					<Text className={styles.way}>-</Text>
				</View>
				<View className={styles.right}>
					<Text className={styles.title}>{item.name}</Text>
					<View className={styles.info}>
						<Text>-</Text>
						<Text>-</Text>
						<Text>-</Text>
						<Text>-</Text>
						<Text>-</Text>
					</View>
					<View className={styles.location}>
						<View className="fa fa-map-marker" />
					</View>
					{/* <view class="fans">
        <text>等81位粉丝</text>
      </view> */}
				</View>
			</Navigator>
		)
	}
}

export default ProjectItem
