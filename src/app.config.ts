export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/services/index',
    'pages/orders/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666666',
    selectedColor: '#25c9f9',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'images/icon-home.png',
        selectedIconPath: 'images/icon-home-h.png'
      },
      {
        pagePath: 'pages/services/index',
        text: '全部服务',
        iconPath: 'images/icon-painter.png',
        selectedIconPath: 'images/icon-painter-h.png'
      },
      {
        pagePath: 'pages/orders/index',
        text: '订单',
        iconPath: 'images/icon-price.png',
        selectedIconPath: 'images/icon-price-h.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'images/icon-user.png',
        selectedIconPath: 'images/icon-user-h.png'
      }
    ]
  }
})
