import { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import styles from './index.module.scss'

interface LoadingProps {
	tips?: string
}

export default class Loading extends Component<LoadingProps, any> {
	render() {
		const { tips } = this.props
		return (
			<View className={styles.main}>
				<View className={styles.icon}></View>
				<View className={styles.tips}>{tips ? tips : '加载中'}</View>
			</View>
		)
	}
}
