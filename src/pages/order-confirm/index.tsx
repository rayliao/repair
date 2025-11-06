import { View, Image, Text } from "@tarojs/components";
import {
  Button,
  InputNumber,
  TextArea,
  Popup,
  Tag,
  Empty,
} from "@nutui/nutui-react-taro";
import {
  ArrowRight,
  Plus,
  User,
  Del,
} from "@nutui/icons-react-taro";
import { useState, useMemo, useEffect } from "react";
import Taro from "@tarojs/taro";
import { useGetServicesDetails } from "../../api/services-api/services-api";
import "./index.scss";

const OrderConfirm = () => {
  const [quantity, setQuantity] = useState(1);
  const [remark, setRemark] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  // 从路由参数获取服务ID
  const params = Taro.getCurrentInstance().router?.params;
  console.log("路由参数:", params);
  const serviceId = parseInt(params?.serviceId || "0");

  // 获取服务详情数据
  const {
    data: serviceDetail,
    isLoading,
    error,
  } = useGetServicesDetails({
    id: serviceId,
  });

  // 模拟联系人数据
  const contacts = useMemo(
    () => [
      {
        id: 1,
        name: "张三",
        phone: "138****8888",
        address: "北京市朝阳区xxx小区xx号楼xx室",
        isDefault: true,
      },
      {
        id: 2,
        name: "李四",
        phone: "139****9999",
        address: "北京市海淀区xxx大厦xx层",
        isDefault: false,
      },
    ],
    []
  );

  // 设置默认联系人
  useEffect(() => {
    const defaultContact = contacts.find((c) => c.isDefault);
    if (defaultContact) {
      setSelectedContact(defaultContact);
    }
  }, [contacts]);

  // 计算总价
  const totalPrice = useMemo(() => {
    const price = serviceDetail?.data?.price || 0;
    return price * quantity;
  }, [serviceDetail, quantity]);

  // 选择联系人
  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
    setShowContactPicker(false);
  };

  // 添加地址
  const handleAddAddress = () => {
    Taro.showToast({
      title: "跳转到添加地址页面",
      icon: "none",
    });
    setShowContactPicker(false);
  };

  // 选择图片
  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 6 - images.length,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        setImages([...images, ...res.tempFilePaths]);
      },
    });
  };

  // 删除图片
  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // 提交订单
  const handleSubmit = () => {
    if (!selectedContact) {
      Taro.showToast({
        title: "请选择联系信息",
        icon: "none",
      });
      return;
    }

    const orderData = {
      serviceId,
      contactId: selectedContact.id,
      quantity,
      remark,
      images,
      totalPrice,
    };

    console.log("提交订单:", orderData);

    Taro.showToast({
      title: "订单提交成功",
      icon: "none",
    });

    // TODO: 调用提交订单 API
    // 跳转到订单详情或支付页面
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  if (isLoading) {
    return (
      <View className="order-confirm-page">
        <View className="loading-container">
          <Empty description="加载中..." />
        </View>
      </View>
    );
  }

  if (error || !serviceDetail?.data) {
    return (
      <View className="order-confirm-page">
        <Empty description="服务信息加载失败" />
      </View>
    );
  }

  const service = serviceDetail.data;

  return (
    <View className="order-confirm">
      {/* 联系信息 */}
      <View className="section contact-section">
        <View className="section-title">联系信息</View>
        <View className="section-content">
          <View className="contact-info" onClick={() => setShowContactPicker(true)}>
            {selectedContact ? (
              <View className="contact-left">
                <View className="contact-name">
                  <User size={14} color="#333" />
                  <Text className="name">{selectedContact.name}</Text>
                  {selectedContact.isDefault && (
                    <Tag type="primary">默认</Tag>
                  )}
                </View>
                <View className="contact-phone">{selectedContact.phone}</View>
                <View className="contact-address">{selectedContact.address}</View>
              </View>
            ) : (
              <View className="contact-left">
                <Text className="name">请选择联系信息</Text>
              </View>
            )}
            <ArrowRight size={14} className="arrow-right" />
          </View>
        </View>
      </View>

      {/* 服务信息 */}
      <View className="section service-section">
        <View className="section-title">服务信息</View>
        <View className="section-content">
          <View className="service-info">
            <View className="service-image">
              {service.banner && service.banner.length > 0 ? (
                <Image
                  src={service.banner[0]}
                  className="image"
                  mode="aspectFill"
                />
              ) : (
                <View className="image-placeholder">🔧</View>
              )}
            </View>
            <View className="service-details">
              <View className="service-title">{service.name}</View>
              {service.description && (
                <View className="service-desc">{service.description}</View>
              )}
              <View className="service-price">
                <Text className="price-main">¥{service.price}</Text>
                <Text className="unit">/次</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 数量选择 */}
      <View className="section quantity-section">
        <View className="section-title">服务数量</View>
        <View className="section-content">
          <View className="quantity-row">
            <Text className="quantity-label">数量</Text>
            <InputNumber
              value={quantity}
              min={1}
              max={99}
              onChange={(value) => setQuantity(Number(value))}
            />
          </View>
        </View>
      </View>

      {/* 备注信息 */}
      <View className="section remark-section">
        <View className="section-title">备注信息</View>
        <View className="section-content">
          <View className="textarea-wrapper">
            <TextArea
              placeholder="请描述您的需求，如故障现象、预约时间等..."
              value={remark}
              onChange={setRemark}
              maxLength={500}
              showCount
              rows={4}
              className="remark-textarea"
            />
          </View>

          {/* 图片上传 */}
          <View className="image-list">
            {images.map((img, index) => (
              <View key={index} className="image-item">
                <Image
                  src={img}
                  className="image"
                  mode="aspectFill"
                />
                <View
                  className="remove-btn"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Del size={8} color="#fff" />
                </View>
              </View>
            ))}
            {images.length < 6 && (
              <View className="upload-btn" onClick={handleChooseImage}>
                <View className="upload-placeholder">
                  <Plus size={16} color="#999" />
                  <Text className="upload-text">添加图片</Text>
                </View>
              </View>
            )}
          </View>

          <View className="upload-tip">
            最多可上传6张图片，帮助师傅更好了解问题
          </View>
        </View>
      </View>

      {/* 底部操作栏 */}
      <View className="bottom-bar">
        <View className="price-info">
          <View className="total-label">总计</View>
          <View className="total-price">¥{totalPrice}</View>
        </View>
        <Button type="primary" className="submit-btn" onClick={handleSubmit}>
          <Text className="submit-text">提交订单</Text>
        </Button>
      </View>

      {/* 联系人选择弹窗 */}
      <Popup
        visible={showContactPicker}
        position="bottom"
        onClose={() => setShowContactPicker(false)}
        className="contact-picker"
      >
        <View className="picker-content">
          <View className="picker-header">
            <View className="picker-title">选择联系信息</View>
          </View>

          <View className="contact-list">
            {contacts.map((contact) => (
              <View
                key={contact.id}
                className="contact-item"
                onClick={() => handleContactSelect(contact)}
              >
                <View className="contact-main">
                  <View className="contact-name-row">
                    <Text className="contact-name">{contact.name}</Text>
                    {contact.isDefault && <Tag type="primary">默认</Tag>}
                  </View>
                  <Text className="contact-phone">{contact.phone}</Text>
                </View>
                <View className="contact-address">{contact.address}</View>
              </View>
            ))}
          </View>

          <Button className="add-contact-btn" onClick={handleAddAddress}>
            <Text className="add-contact-text">添加新地址</Text>
          </Button>
        </View>
      </Popup>
    </View>
  );
};

export default OrderConfirm;
