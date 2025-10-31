export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/services/index",
    "pages/service-list/index",
    "pages/service-detail/index",
    "pages/order-confirm/index",
    "pages/orders/index",
    "pages/profile/index",
  ],
  window: {
    navigationBarBackgroundColor: "#d81e06",
    navigationBarTitleText: "维修服务",
    navigationBarTextStyle: "white",
    backgroundColor: "#f8f8f8",
  },
  tabBar: {
    color: "#666666",
    selectedColor: "#d81e06",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "images/home.png",
        selectedIconPath: "images/home.png",
      },
      {
        pagePath: "pages/services/index",
        text: "全部服务",
        iconPath: "images/service.png",
        selectedIconPath: "images/service.png",
      },
      {
        pagePath: "pages/orders/index",
        text: "订单",
        iconPath: "images/order.png",
        selectedIconPath: "images/order.png",
      },
      {
        pagePath: "pages/profile/index",
        text: "我的",
        iconPath: "images/user.png",
        selectedIconPath: "images/user.png",
      },
    ],
  },
});
