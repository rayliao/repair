import { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import styles from './index.module.scss'
import { isWeapp } from '../../utils/config'

interface DetailProps {
	images: string[]
	content: string
	onOpegallery: any
}

export default class DynamicDetail extends Component<DetailProps, any> {
	render() {
		const { images, content, onOpegallery } = this.props
		return (
			<View className={styles.detail}>
				<Text>{content}</Text>
				<View className={styles.images}>
					{images.map((item, k) => (
						<View
							onClick={onOpegallery.bind(this, k, images)}
							key={k}
							className={styles.imageArea}
						>
							<Image className={styles.image} src={item} lazyLoad={isWeapp} />
						</View>
					))}
				</View>
			</View>
		)
	}
}
