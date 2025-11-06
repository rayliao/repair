import Taro, { Component } from '@tarojs/taro'
import { View, Form, Picker, Text, Input, Button } from '@tarojs/components'
import styles from './index.module.scss'
import { decoration } from '../../utils/index'
import { addQuote } from '../../services/user'
import { globalData, storage } from '../../utils/config'

interface PriceFormProps {
	/**
	 * 1-获取报价，2-预约设计师，3-预约参观工地, 4-进店有礼
	 */
	source: number
	isIndex?: boolean
	closeModal?: any
}

const btnText = ['免费获取报价', '免费预约设计师', '免费预约参观', '获取礼品']

export default class PriceForm extends Component<PriceFormProps, any> {
	static options = {
		addGlobalClass: true
	}
	state = {
		pickerIndex: 0,
		size: '',
		phone: ''
	}
	formSubmit = e => {
		const that = this
		const { closeModal, source } = that.props
		let doing = false
		if (!doing) {
			const { Size, Phone } = e.detail.value
			if (!Size) {
				Taro.showToast({
					title: '请输入您的房屋面积'
				})
				return
			}
			if (!Phone || Phone.length !== 11) {
				Taro.showToast({
					title: '请输入正确手机号码'
				})
				return
			}
			that.setState({
				size: Size,
				phone: Phone
			})
			doing = true
			let sid = Taro.getStorageSync(storage.salerId)
			sid = sid ? parseInt(sid, 10) : 0
			// checkLogin(() => {
			addQuote(
				{
					CompanyId: globalData.cid!,
					salerId: sid,
					Size,
					Phone,
					Type: that.state.pickerIndex,
					source
				},
				res => {
					if (res.code === 0) {
						that.setState({
							size: '',
							phone: ''
						})
						closeModal && closeModal()
					}
					Taro.showToast({
						title: res.message
					})
					doing = false
				}
			)
			// })
		}
	}
	onChange = e => {
		this.setState({
			pickerIndex: parseInt(e.detail.value, 10)
		})
	}
	company = Taro.getStorageSync(storage.company)
	render() {
		const { source } = this.props
		const { pickerIndex, size, phone } = this.state
		return (
			<Form className="form-list" onSubmit={this.formSubmit}>
				{source === 4 ? (
					<View className={styles.giftText}>{this.company.giftText}</View>
				) : null}
				<Picker
					name="Type"
					className="form-item"
					value={pickerIndex}
					range={decoration}
					mode="selector"
					onChange={this.onChange}
				>
					<View className="picker">
						<Text>{decoration[pickerIndex]}</Text>
						<View className="fa fa-angle-down" />
					</View>
				</Picker>
				<View className="form-item">
					<Input
						className="input"
						name="Size"
						maxLength={10}
						value={size}
						placeholder="您的房屋面积"
					/>
				</View>
				<View className="form-item">
					<Input
						name="Phone"
						maxLength={11}
						value={phone}
						type="number"
						className="input"
						placeholder="请输入手机号码"
					/>
				</View>
				<View className={styles.info}>
					<text>为了保障您的权益，您的所有信息不会泄漏给他人</text>
				</View>
				<View className="form-handle">
					<Button
						className={`button button-primary ${
							source === 4 ? styles.giftBtn : ''
						}`}
						form-type="submit"
					>
						{btnText[source - 1]}
					</Button>
				</View>
			</Form>
		)
	}
}
