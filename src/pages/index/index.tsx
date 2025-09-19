import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'

import './index.scss'

export default class Index extends Component<PropsWithChildren> {
  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='<%= pageName %>'>
        <Text>Hello world!</Text>
        <Button type="primary">I need Taro UI</Button>
        <Text>Taro UI 支持 Vue 了吗？</Text>
        <Button type='primary' shape='round'>支持</Button>
        <Text>共建？</Text>
        <Button type='default' shape='round'>来</Button>
      </View>
    )
  }
}
