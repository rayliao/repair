import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Tag } from '@nutui/nutui-react-taro'
import './index.scss'

export default class Orders extends Component<PropsWithChildren> {
  state = {
    activeTab: 0,
    orders: [
      {
        id: '202309190001',
        title: '家电维修服务',
        status: '进行中',
        statusType: 'primary',
        amount: '¥200',
        createTime: '2023-09-18 14:30',
        description: '空调不制冷，需要上门检修'
      },
      {
        id: '202309180002',
        title: '水电维修',
        status: '已完成',
        statusType: 'success',
        amount: '¥150',
        createTime: '2023-09-17 10:15',
        description: '厨房水龙头漏水维修'
      },
      {
        id: '202309170003',
        title: '墙面修补',
        status: '待支付',
        statusType: 'warning',
        amount: '¥300',
        createTime: '2023-09-16 16:20',
        description: '客厅墙面裂缝修补及重新刷漆'
      }
    ]
  }

  componentDidMount () {
    console.log('Orders page mounted')
  }

  handleTabClick = (index: number) => {
    this.setState({ activeTab: index })
  }

  handleOrderDetail = (orderId: string) => {
    console.log('查看订单详情:', orderId)
    // TODO: 跳转到订单详情页
  }

  render () {
    const { activeTab, orders } = this.state
    const tabs = ['全部', '进行中', '已完成', '待支付']

    return (
      <View className='orders'>
        <View className='orders-header'>
          <Text className='orders-title'>我的订单</Text>
        </View>

        <View className='orders-tabs'>
          {tabs.map((tab, index) => (
            <View
              key={index}
              className={`tab-item ${activeTab === index ? 'active' : ''}`}
              onClick={() => this.handleTabClick(index)}
            >
              <Text className='tab-text'>{tab}</Text>
            </View>
          ))}
        </View>

        <View className='orders-content'>
          {orders.map((order) => (
            <View key={order.id} className='order-item'>
              <View className='order-header'>
                <Text className='order-id'>订单号: {order.id}</Text>
                <Tag type={order.statusType as any}>{order.status}</Tag>
              </View>

              <View className='order-body'>
                <Text className='order-title'>{order.title}</Text>
                <Text className='order-desc'>{order.description}</Text>
                <View className='order-info'>
                  <Text className='order-amount'>{order.amount}</Text>
                  <Text className='order-time'>{order.createTime}</Text>
                </View>
              </View>

              <View className='order-footer'>
                <Button
                  size='small'
                  type='primary'
                  fill='outline'
                  onClick={() => this.handleOrderDetail(order.id)}
                >
                  查看详情
                </Button>
                {order.status === '待支付' && (
                  <Button size='small' type='primary'>
                    立即支付
                  </Button>
                )}
              </View>
            </View>
          ))}

          {orders.length === 0 && (
            <View className='empty-state'>
              <Text className='empty-text'>暂无订单</Text>
            </View>
          )}
        </View>
      </View>
    )
  }
}
