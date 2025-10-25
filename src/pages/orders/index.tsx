import { View } from "@tarojs/components";
import {
  Tabs,
  TabPane,
  Tag,
  Button,
  Empty,
} from "@nutui/nutui-react-taro";
import { useState, useMemo } from "react";
import "./index.scss";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("0");
  const [searchText, setSearchText] = useState("");

  const allOrders = [
    {
      id: "202309190001",
      title: "家电维修服务",
      status: "进行中",
      statusType: "primary",
      amount: "¥200",
      createTime: "2023-09-18 14:30",
      description: "空调不制冷，需要上门检修",
    },
    {
      id: "202309180002",
      title: "水电维修",
      status: "已完成",
      statusType: "success",
      amount: "¥150",
      createTime: "2023-09-17 10:15",
      description: "厨房水龙头漏水维修",
    },
    {
      id: "202309170003",
      title: "墙面修补",
      status: "待支付",
      statusType: "warning",
      amount: "¥300",
      createTime: "2023-09-16 16:20",
      description: "客厅墙面裂缝修补及重新刷漆",
    },
    {
      id: "202309160004",
      title: "门窗维修",
      status: "进行中",
      statusType: "primary",
      amount: "¥250",
      createTime: "2023-09-15 09:00",
      description: "卧室窗户损坏维修",
    },
    {
      id: "202309150005",
      title: "管道疏通",
      status: "已完成",
      statusType: "success",
      amount: "¥180",
      createTime: "2023-09-14 11:30",
      description: "厕所管道疏通服务",
    },
  ];

  // 按状态筛选订单
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    // 按状态筛选
    if (activeTab === "1") {
      filtered = filtered.filter((order) => order.status === "进行中");
    } else if (activeTab === "2") {
      filtered = filtered.filter((order) => order.status === "已完成");
    } else if (activeTab === "3") {
      filtered = filtered.filter((order) => order.status === "待支付");
    }

    // 按搜索文本筛选
    if (searchText.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.title.toLowerCase().includes(searchText.toLowerCase()) ||
          order.id.includes(searchText) ||
          order.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  }, [activeTab, searchText]);

  const getStatusTagType = (status: string) => {
    switch (status) {
      case "进行中":
        return "primary";
      case "已完成":
        return "success";
      case "待支付":
        return "warning";
      default:
        return "default";
    }
  };

  const handleOrderDetail = (orderId: string) => {
    console.log("查看订单详情:", orderId);
    // TODO: 跳转到订单详情页
  };

  return (
    <View className="orders-page">
      {/* 标签页 */}
      <View className="orders-tabs">
        <Tabs
          value={activeTab}
          onChange={(value) => {
            setActiveTab(String(value));
            setSearchText("");
          }}
        >
          <TabPane title="全部订单" />
          <TabPane title="进行中" />
          <TabPane title="已完成" />
          <TabPane title="待支付" />
        </Tabs>
      </View>

      {/* 订单列表 */}
      <View className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <View key={order.id} className="order-card-wrapper">
              <View className="order-card">
                {/* 卡片头部：标题 + 金额 */}
                <View className="order-header">
                  <View className="order-title-section">
                    <View className="order-title">{order.title}</View>
                    <View className="order-meta">
                    <Tag type={getStatusTagType(order.status)}>
                      {order.status}
                    </Tag>
                    </View>
                  </View>
                  <View className="order-amount">{order.amount}</View>
                </View>

                {/* 订单编号 */}
                <View className="order-id-section">
                  <View className="label">订单号</View>
                  <View className="value">{order.id}</View>
                </View>

                {/* 下单时间 */}
                <View className="order-time-section">
                  <View className="label">下单时间</View>
                  <View className="value">{order.createTime}</View>
                </View>

                {/* 服务描述 */}
                <View className="order-description-section">
                  <View className="label">服务描述</View>
                  <View className="value description">
                    {order.description}
                  </View>
                </View>

                {/* 操作按钮 */}
                <View className="order-actions">
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleOrderDetail(order.id)}
                  >
                    查看详情
                  </Button>
                  {order.status === "待支付" && (
                    <Button
                      type="default"
                      size="small"
                      onClick={() => console.log("支付订单:", order.id)}
                    >
                      立即支付
                    </Button>
                  )}
                  {order.status === "已完成" && (
                    <Button
                      type="default"
                      size="small"
                      onClick={() => console.log("评价订单:", order.id)}
                    >
                      评价
                    </Button>
                  )}
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="empty-container">
            <Empty description="暂无订单数据" />
          </View>
        )}
      </View>
    </View>
  );
};

export default Orders;
