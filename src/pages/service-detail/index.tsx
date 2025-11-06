import { View, Image, Text } from "@tarojs/components";
import {
  Button,
  Tabs,
  TabPane,
  Swiper,
  SwiperItem,
  Tag,
  Cell,
  Rate,
  Empty,
  Popup,
} from "@nutui/nutui-react-taro";
import {
  HeartFill,
  Heart,
  Service,
  Phone,
} from "@nutui/icons-react-taro";
import { useState, useMemo } from "react";
import Taro from "@tarojs/taro";
import { useGetServicesDetails } from "../../api/services-api/services-api";
import "./index.scss";
import { host } from "../../utils/config";

const ServiceDetail = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // 从路由参数获取服务ID
  const params = Taro.getCurrentInstance().router?.params;
  const serviceId = parseInt(params?.id || "0");

  // 获取服务详情数据
  const { data: serviceDetail, isLoading, error } = useGetServicesDetails({
    id: serviceId
  });

  // 处理轮播图数据
  const bannerImages = useMemo(() => {
    if (!serviceDetail?.data?.banner || !Array.isArray(serviceDetail.data.banner)) return [];
    return serviceDetail.data.banner.filter(img => img?.trim());
  }, [serviceDetail]);

  // 处理服务内容
  const serviceContent = useMemo(() => {
    return serviceDetail?.data?.description || "暂无服务内容介绍";
  }, [serviceDetail]);

  // 模拟用户评价数据
  const reviews = useMemo(() => [
    {
      id: 1,
      username: "张**",
      avatar: "https://via.placeholder.com/40/d81e06/ffffff?text=张",
      rating: 5,
      content: "师傅很专业，服务态度好，维修效果满意！",
      time: "2024-01-15",
      images: ["https://via.placeholder.com/60", "https://via.placeholder.com/60"]
    },
    {
      id: 2,
      username: "李**",
      avatar: "https://via.placeholder.com/40/d81e06/ffffff?text=李",
      rating: 4,
      content: "上门及时，价格合理，推荐！",
      time: "2024-01-10",
      images: []
    }
  ], []);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Taro.showToast({
      title: isFavorite ? "已取消收藏" : "已收藏",
      icon: "none",
    });
  };

  const handleContact = () => {
    setShowContact(true);
  };

  const handleBooking = () => {
    // 跳转到订单确认页面，传递服务ID
    Taro.navigateTo({
      url: `/pages/order-confirm/index?serviceId=${serviceId}`
    });
  };

  const handleCall = () => {
    Taro.makePhoneCall({
      phoneNumber: "400-123-4567"
    });
    setShowContact(false);
  };

  const handleOnlineService = () => {
    Taro.showToast({
      title: "跳转到在线客服",
      icon: "none",
    });
    setShowContact(false);
  };

  if (isLoading) {
    return (
      <View className="service-detail-page">
        <View className="loading-container">
          <View className="loading-text">加载中...</View>
        </View>
      </View>
    );
  }

  if (error || !serviceDetail?.data) {
    return (
      <View className="service-detail-page">
        <Empty description="服务详情加载失败" />
      </View>
    );
  }

  const service = serviceDetail.data;

  return (
    <View className="service-detail-page">
      {/* 图片轮播 */}
      <View className="banner-section">
        {bannerImages.length > 0 ? (
          <Swiper
            height={250}
            autoPlay
            loop
            indicatorDots
            indicatorColor="rgba(255,255,255,0.3)"
            indicatorActiveColor="#d81e06"
          >
            {bannerImages.map((image, index) => (
              <SwiperItem key={index}>
                <Image
                  src={`${host}${image}`}
                  className="banner-image"
                  mode="aspectFill"
                />
              </SwiperItem>
            ))}
          </Swiper>
        ) : (
          <View className="banner-placeholder">
            <Image
              src="https://via.placeholder.com/375x250/f5f5f5/999999?text=暂无图片"
              className="banner-image"
              mode="aspectFill"
            />
          </View>
        )}
      </View>

      {/* 服务信息 */}
      <View className="service-info">
        <View className="service-header">
          <View className="service-title">{service.name}</View>
          <View className="service-price">
            <View className="price-label">起步价</View>
            <View className="price-value">
              ¥<Text className="price-number">{service.price}</Text>
            </View>
          </View>
        </View>

        <View className="service-tags">
          <Tag type="primary">专业维修</Tag>
          <Tag type="success">上门服务</Tag>
          <Tag>质量保证</Tag>
        </View>

        <View className="service-desc">
          {service.description || "专业维修服务，质量保证，价格透明"}
        </View>
      </View>

      {/* Tab切换内容 */}
      <View className="tabs-section">
        <Tabs
          value={activeTab}
          onChange={(index) => setActiveTab(Number(index))}
          activeColor="#d81e06"
        >
          <TabPane title="服务内容">
            <View className="tab-content">
              <View className="content-section">
                <View className="content-title">服务详情</View>
                <View className="content-text">{serviceContent}</View>
              </View>

              <View className="content-section">
                <View className="content-title">服务流程</View>
                <View className="process-list">
                  <View className="process-item">
                    <View className="process-number">1</View>
                    <View className="process-text">在线下单预约</View>
                  </View>
                  <View className="process-item">
                    <View className="process-number">2</View>
                    <View className="process-text">师傅上门检测</View>
                  </View>
                  <View className="process-item">
                    <View className="process-number">3</View>
                    <View className="process-text">确认方案报价</View>
                  </View>
                  <View className="process-item">
                    <View className="process-number">4</View>
                    <View className="process-text">开始维修服务</View>
                  </View>
                  <View className="process-item">
                    <View className="process-number">5</View>
                    <View className="process-text">验收完成付款</View>
                  </View>
                </View>
              </View>
            </View>
          </TabPane>

          <TabPane title="用户评价">
            <View className="tab-content">
              {reviews.length > 0 ? (
                <View className="reviews-list">
                  {reviews.map((review) => (
                    <View key={review.id} className="review-item">
                      <View className="review-header">
                        <View className="review-user">
                          <Image
                            src={review.avatar}
                            className="user-avatar"
                            mode="scaleToFill"
                          />
                          <View className="user-info">
                            <View className="username">{review.username}</View>
                            <View className="review-time">{review.time}</View>
                          </View>
                        </View>
                        <Rate
                          value={review.rating}
                          readOnly
                          size="small"
                        />
                      </View>

                      <View className="review-content">{review.content}</View>

                      {review.images.length > 0 && (
                        <View className="review-images">
                          {review.images.map((img, index) => (
                            <Image
                              key={index}
                              src={img}
                              className="review-image"
                              mode="aspectFill"
                            />
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <Empty description="暂无用户评价" />
              )}
            </View>
          </TabPane>
        </Tabs>
      </View>

      {/* 底部操作栏 */}
      <View className="bottom-bar">
        <View className="action-buttons">
          <Button
            className="action-btn favorite-btn"
            onClick={handleFavorite}
          >
            {isFavorite ? (
              <HeartFill size={20} color="#d81e06" />
            ) : (
              <Heart size={20} color="#999" />
            )}
            <View className="btn-text">收藏</View>
          </Button>

          <Button
            className="action-btn contact-btn"
            onClick={handleContact}
          >
            <Service size={20} color="#999" />
            <View className="btn-text">客服</View>
          </Button>

          <Button
            type="primary"
            className="booking-btn"
            onClick={handleBooking}
          >
            立即预约
          </Button>
        </View>
      </View>

      {/* 联系客服弹窗 */}
      <Popup
        visible={showContact}
        position="bottom"
        onClose={() => setShowContact(false)}
        className="contact-popup"
      >
        <View className="popup-content">
          <View className="popup-title">联系客服</View>
          <View className="contact-options">
            <Cell
              title="电话客服"
              description="400-123-4567"
              onClick={handleCall}
            >
              <Phone size={20} color="#d81e06" />
            </Cell>
            <Cell
              title="在线客服"
              description="快速响应，即时沟通"
              onClick={handleOnlineService}
            >
              <Service size={20} color="#d81e06" />
            </Cell>
          </View>
        </View>
      </Popup>
    </View>
  );
};

export default ServiceDetail;
