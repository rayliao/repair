import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Avatar, Cell, CellGroup } from '@nutui/nutui-react-taro'
import './index.scss'

export default class Profile extends Component<PropsWithChildren> {
  state = {
    userInfo: {
      name: '用户名',
      phone: '138****8888',
      avatar: ''
    },
    stats: [
      { label: '待付款', count: 2 },
      { label: '待服务', count: 1 },
      { label: '待评价', count: 3 },
      { label: '退款/售后', count: 0 }
    ]
  }

  componentDidMount () {
    console.log('Profile page mounted')
  }

  handleLogin = () => {
    console.log('跳转到登录页面')
    // TODO: 实现登录逻辑
  }

  handleMenuClick = (type: string) => {
    console.log('菜单点击:', type)
    // TODO: 实现各菜单功能
  }

  render () {
    const { userInfo, stats } = this.state

    return (
      <View className='profile'>
        {/* 用户信息区域 */}
        <View className='profile-header'>
          <View className='user-info'>
            <Avatar size='large' src={userInfo.avatar}>
              {userInfo.name.charAt(0)}
            </Avatar>
            <View className='user-details'>
              <Text className='user-name'>{userInfo.name}</Text>
              <Text className='user-phone'>{userInfo.phone}</Text>
            </View>
            <Button
              size='small'
              type='primary'
              fill='outline'
              onClick={this.handleLogin}
            >
              登录/注册
            </Button>
          </View>
        </View>

        {/* 订单统计 */}
        <View className='order-stats'>
          <Text className='stats-title'>我的订单</Text>
          <View className='stats-grid'>
            {stats.map((stat, index) => (
              <View key={index} className='stat-item'>
                <Text className='stat-count'>{stat.count}</Text>
                <Text className='stat-label'>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 功能菜单 */}
        <View className='menu-section'>
          <CellGroup>
            <Cell
              title="我的收藏"
              extra="查看全部"
              onClick={() => this.handleMenuClick('favorites')}
            />
            <Cell
              title="我的地址"
              extra="管理地址"
              onClick={() => this.handleMenuClick('address')}
            />
            <Cell
              title="我的优惠券"
              extra="3张可用"
              onClick={() => this.handleMenuClick('coupons')}
            />
            <Cell
              title="我的钱包"
              extra="¥168.00"
              onClick={() => this.handleMenuClick('wallet')}
            />
          </CellGroup>
        </View>

        <View className='menu-section'>
          <CellGroup>
            <Cell
              title="客服中心"
              onClick={() => this.handleMenuClick('service')}
            />
            <Cell
              title="意见反馈"
              onClick={() => this.handleMenuClick('feedback')}
            />
            <Cell
              title="关于我们"
              onClick={() => this.handleMenuClick('about')}
            />
            <Cell
              title="设置"
              onClick={() => this.handleMenuClick('settings')}
            />
          </CellGroup>
        </View>
      </View>
    )
  }
}
