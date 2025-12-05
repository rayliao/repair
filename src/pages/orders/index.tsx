import { View } from "@tarojs/components";
import {
  Tabs,
  TabPane,
  Tag,
  Button,
  Empty,
  Picker,
} from "@nutui/nutui-react-taro";
import { useState, useMemo, useEffect } from "react";
import {
  usePostOrderList,
  useGetOrderCancelReasons,
  usePostOrderCancel,
} from "../../api/order-api/order-api";
import CustomLoading from "../../components/Loading";
import Taro from "@tarojs/taro";
import { useAuth } from "../../utils/useAuth";
import "./index.scss";

const Orders = () => {
  // 登录鉴权
  const { isLogin } = useAuth();

  const [activeTab, setActiveTab] = useState("0");
  const [searchText, setSearchText] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelReasons, setCancelReasons] = useState<string[]>([]);
  const [selectedReasonIndex, setSelectedReasonIndex] = useState(0);

  // 页面初始化时加载订单列表
  const {
    trigger: loadOrderList,
    data: orderListData,
    isMutating: isLoading,
  } = usePostOrderList();

  // 获取取消理由列表
  const { data: cancelReasonsData, error: cancelReasonsError } =
    useGetOrderCancelReasons();

  // 初始化取消理由列表
  useEffect(() => {
    if (cancelReasonsData?.data) {
      setCancelReasons(cancelReasonsData.data);
    }
  }, [cancelReasonsData]);

  // 格式化取消理由为 Picker 选项
  const pickerOptions = useMemo(() => {
    return [cancelReasons.map((reason) => ({
      label: reason,
      value: reason
    }))];
  }, [cancelReasons]);

  // 取消订单
  const { trigger: cancelOrder, isMutating: isCanceling } =
    usePostOrderCancel();

  // 订单状态映射
  const getOrderStatusText = (orderState?: number, payState?: number) => {
    if (orderState === 4) return "已取消";
    if (orderState === 3) return "已完成";
    if (orderState === 2) return "服务中";
    if (orderState === 1) return "已接单";
    if (payState === 0) return "已下单";
    if (!orderState) return "已下单";
    return "未知状态";
  };

  // 获取状态对应的标签类型
  const getStatusTagType = (statusText: string) => {
    switch (statusText) {
      case "服务中":
      case "已接单":
        return "primary";
      case "已完成":
        return "success";
      case "已下单":
        return "warning";
      case "已取消":
        return "danger";
      default:
        return "default";
    }
  };

  // 订单列表
  const allOrders = useMemo(() => {
    return orderListData?.data || [];
  }, [orderListData]);

  // 获取订单列表
  useEffect(() => {
    loadOrderList();
  }, [loadOrderList]);

  // 按状态筛选订单
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    // 按状态筛选
    if (activeTab === "1") {
      // 已下单（待支付状态或没有订单状态的新订单）
      filtered = filtered.filter(
        (order) => order.payState === 0 || !order.orderState
      );
    } else if (activeTab === "2") {
      // 服务中（已接单、服务中）
      filtered = filtered.filter(
        (order) => order.orderState === 1 || order.orderState === 2
      );
    } else if (activeTab === "3") {
      // 已完成
      filtered = filtered.filter((order) => order.orderState === 3);
    } else if (activeTab === "4") {
      // 已取消
      filtered = filtered.filter((order) => order.orderState === 4);
    }

    // 按搜索文本筛选
    if (searchText.trim()) {
      filtered = filtered.filter((order) => {
        const orderNo = order.orderNo || "";
        const remark = order.remark || "";
        const contact = order.contact || "";

        return (
          orderNo.includes(searchText) ||
          remark.toLowerCase().includes(searchText.toLowerCase()) ||
          contact.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    return filtered;
  }, [allOrders, activeTab, searchText]);

  // 处理取消订单点击
  const handleCancelOrder = (orderId?: number) => {
    if (!orderId) return;
    setSelectedOrderId(orderId);
    setPickerVisible(true);
  };

  // Picker 确认回调
  const handlePickerConfirm = (options: any, values: any) => {
    setPickerVisible(false);
    const selectedReason = values[0];

    // 显示确认对话框
    Taro.showModal({
      title: '确认取消订单',
      content: `取消理由：${selectedReason}`,
      success: async (res) => {
        if (res.confirm) {
          await confirmCancelOrder(selectedReason);
        }
      }
    });
  };

  // 确认取消订单
  const confirmCancelOrder = async (reason: string) => {
    if (!selectedOrderId || !reason) {
      Taro.showToast({
        title: "请选择取消理由",
        icon: "none",
      });
      return;
    }

    try {
      const result = await cancelOrder({
        orderId: selectedOrderId,
        reason: reason,
      });

      if (result?.code === 0) {
        Taro.showToast({
          title: "订单取消成功",
          icon: "success",
        });
        // 重新加载订单列表
        loadOrderList();
        // 重置状态
        setSelectedOrderId(null);
        setSelectedReasonIndex(0);
      } else {
        Taro.showToast({
          title: result?.message || "取消失败",
          icon: "none",
        });
      }
    } catch (error) {
      console.error("取消订单失败:", error);
      Taro.showToast({
        title: "网络错误，请重试",
        icon: "none",
      });
    }
  };

  const handleOrderDetail = (orderId?: number) => {
    if (!orderId) return;
    console.log("查看订单详情:", orderId);
    // TODO: 跳转到订单详情页
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <View className="orders-page">
        <CustomLoading text="加载订单列表..." />
      </View>
    );
  }

  // 如果未登录，不渲染页面内容
  if (!isLogin) {
    return null;
  }

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
          <TabPane title="全部" />
          <TabPane title="已下单" />
          <TabPane title="服务中" />
          <TabPane title="已完成" />
          <TabPane title="已取消" />
        </Tabs>
      </View>

      {/* 订单列表 */}
      <View className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusText = getOrderStatusText(
              order.orderState,
              order.payState
            );
            const displayAmount = order.paid
              ? `¥${order.paid}`
              : order.negotiable
              ? `¥${order.negotiable}`
              : "面议";

            return (
              <View key={order.id} className="order-card-wrapper">
                <View className="order-card">
                  {/* 顶部：订单号 + 状态标签 */}
                  <View className="order-top">
                    <View className="order-no">单号：{order.orderNo}</View>
                    <Tag type={getStatusTagType(statusText)}>{statusText}</Tag>
                  </View>

                  {/* 中间：订单服务信息 */}
                  <View className="order-service">
                    <View className="service-info">
                      <View className="service-title">
                        服务ID: {order.servicesId || "未知"}
                      </View>
                      {order.servicesSpecificationId && (
                        <View className="service-spec">
                          规格ID: {order.servicesSpecificationId}
                        </View>
                      )}
                      {order.quantity && order.quantity > 1 && (
                        <View className="service-quantity">
                          数量: {order.quantity}
                        </View>
                      )}
                    </View>
                  </View>

                  {/* 底部：金额时间 + 操作按钮 */}
                  <View className="order-bottom">
                    <View className="order-info">
                      <View className="amount-info">
                        <View className="amount-label">
                          {order.payState === 0 ? "待支付：" : "金额："}
                        </View>
                        <View className="amount-value">{displayAmount}</View>
                      </View>
                      {order.createdOn && (
                        <View className="time-info">
                          {new Date(order.createdOn).toLocaleDateString(
                            "zh-CN"
                          )}
                        </View>
                      )}
                    </View>

                    <View className="order-actions">
                      {order.payState === 0 && order.orderState !== 4 && (
                        <>
                          <Button
                            type="default"
                            size="small"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            取消订单
                          </Button>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => console.log("支付订单:", order.id)}
                          >
                            立即支付
                          </Button>
                        </>
                      )}
                      {order.orderState === 3 && (
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
              </View>
            );
          })
        ) : (
          <View className="empty-container">
            <Empty description="暂无订单数据" />
          </View>
        )}
      </View>

      {/* 取消订单选择器 */}
      <Picker
        title="选择取消理由"
        visible={pickerVisible}
        options={pickerOptions}
        onConfirm={handlePickerConfirm}
        onCancel={() => {
          setPickerVisible(false);
          setSelectedOrderId(null);
        }}
      />
    </View>
  );
};

export default Orders;
