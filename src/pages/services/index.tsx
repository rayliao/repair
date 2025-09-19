import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import './index.scss'

export default class Services extends Component<PropsWithChildren> {
  componentDidMount () {
    console.log('Services page mounted')
  }

  render () {
    return (
      <View className='services'>
        <View className='services-header'>
          <Text className='services-title'>全部服务</Text>
        </View>

        <View className='services-content'>
          <View className='service-category'>
            <Text className='category-title'>维修服务</Text>
            <View className='service-grid'>
              <View className='service-item'>
                <Text className='service-name'>家电维修</Text>
              </View>
              <View className='service-item'>
                <Text className='service-name'>水电维修</Text>
              </View>
              <View className='service-item'>
                <Text className='service-name'>门窗维修</Text>
              </View>
              <View className='service-item'>
                <Text className='service-name'>墙面修补</Text>
              </View>
            </View>
          </View>

          <View className='service-category'>
            <Text className='category-title'>装修服务</Text>
            <View className='service-grid'>
              <View className='service-item'>
                <Text className='service-name'>室内设计</Text>
              </View>
              <View className='service-item'>
                <Text className='service-name'>装修施工</Text>
              </View>
              <View className='service-item'>
                <Text className='service-name'>软装搭配</Text>
              </View>
              <View className='service-item'>
                <Text className='service-name'>验收服务</Text>
              </View>
            </View>
          </View>

          <View className='quick-action'>
            <Button type='primary' size='large'>
              立即咨询
            </Button>
          </View>
        </View>
      </View>
    )
  }
}
