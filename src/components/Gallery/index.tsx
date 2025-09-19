import { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import styles from './index.module.scss'
import Loading from '../Loading'

interface GalleryProps {
	show: boolean
	imgUrls?: string[]
	current: number
	hideGallery?: any
}

class Gallery extends Component<GalleryProps, any> {
	render() {
		const { show, imgUrls, current, hideGallery } = this.props
		return (
			<View
				className={`${styles.main} ${show ? styles.show : ''}`}
				onClick={hideGallery}
			>
				{imgUrls ? (
					<Swiper
						className={styles.swiper}
						current={current}
						indicatorDots={true}
						indicatorColor="#666"
						indicatorActiveColor="#eee"
					>
						{imgUrls.map((url, index) => (
							<SwiperItem key={index}>
								<Image className={styles.image} mode="aspectFit" src={url} />
							</SwiperItem>
						))}
					</Swiper>
				) : (
					<Loading />
				)}
			</View>
		)
	}
}

export default Gallery
