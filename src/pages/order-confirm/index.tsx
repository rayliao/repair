import { View, Image, Text } from "@tarojs/components";
import {
  Button,
  InputNumber,
  TextArea,
  Popup,
  Tag,
} from "@nutui/nutui-react-taro";
import { ArrowRight, Plus, User, Del } from "@nutui/icons-react-taro";
import { useState, useMemo, useEffect } from "react";
import Taro from "@tarojs/taro";
import { useGetServicesDetails } from "../../api/services-api/services-api";
import { usePostAddressList } from "../../api/address-api/address-api";
import type { Address } from "../../api/model/address";
import "./index.scss";
import CustomLoading from "../../components/Loading";

const OrderConfirm = () => {
  const [quantity, setQuantity] = useState(1);
  const [remark, setRemark] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Address | null>(null);

  // 从路由参数获取服务ID和规格ID
  const params = Taro.getCurrentInstance().router?.params;
  console.log("路由参数:", params);
  const serviceId = parseInt(params?.serviceId || "0");
  const specId = params?.specId ? parseInt(params.specId) : null;

  // 获取服务详情数据
  const {
    data: serviceDetail,
    isLoading: isServiceLoading,
    error: serviceError,
  } = useGetServicesDetails({
    id: serviceId,
  });

  // 获取地址列表数据
  const {
    trigger: loadAddressList,
    data: addressListData,
    isMutating: isAddressLoading,
  } = usePostAddressList();

  // 地址列表
  const addresses = useMemo(() => {
    return addressListData?.data || [];
  }, [addressListData]);

  // 选中的服务规格
  const selectedSpec = useMemo(() => {
    if (!specId || !serviceDetail?.data?.servicesSpecificationItems) {
      return null;
    }
    return serviceDetail.data.servicesSpecificationItems.find(
      (spec) => spec.id === specId
    );
  }, [specId, serviceDetail]);

  // 获取地址列表
  useEffect(() => {
    loadAddressList();
  }, [loadAddressList]);

  // 页面显示时刷新地址列表
  Taro.useDidShow(() => {
    loadAddressList();
  });

  // 设置默认地址
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedContact(defaultAddress);
      } else {
        // 如果没有默认地址，选择第一个
        setSelectedContact(addresses[0]);
      }
    }
  }, [addresses]);

  // 计算总价
  const totalPrice = useMemo(() => {
    const price = serviceDetail?.data?.price || 0;
    return price * quantity;
  }, [serviceDetail, quantity]);

  // 选择联系人
  const handleContactSelect = (contact: Address) => {
    setSelectedContact(contact);
    setShowContactPicker(false);
  };

  // 添加地址
  const handleAddAddress = () => {
    Taro.navigateTo({
      url: "/pages/address-add/index",
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
      specId,
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

  if (isServiceLoading || !serviceDetail?.data) {
    return (
      <View className="order-confirm-page">
        <CustomLoading text="加载服务信息..." />
      </View>
    );
  }

  const service = serviceDetail?.data;

  return (
    <View className="order-confirm">
      {/* 联系信息 */}
      <View className="section contact-section">
        <View className="section-title">联系信息</View>
        <View className="section-content">
          <View
            className="contact-info"
            onClick={() => setShowContactPicker(true)}
          >
            {selectedContact ? (
              <View className="contact-left">
                <View className="contact-name">
                  <User size={14} color="#333" />
                  <Text className="name">{selectedContact.contact}</Text>
                  {selectedContact.isDefault && <Tag type="primary">默认</Tag>}
                </View>
                <View className="contact-phone">{selectedContact.phone}</View>
                <View className="contact-address">
                  {selectedContact.street} {selectedContact.unit}
                </View>
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
              {selectedSpec && (
                <View className="service-spec">
                  <Text className="spec-label">规格：</Text>
                  <Text className="spec-value">{selectedSpec.name}</Text>
                </View>
              )}
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
                <Image src={img} className="image" mode="aspectFill" />
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
            {isAddressLoading ? (
              <View className="loading-container">
                <CustomLoading text="加载地址中..." size="small" />
              </View>
            ) : addresses.length > 0 ? (
              addresses.map((address) => (
                <View
                  key={address.id}
                  className="contact-item"
                  onClick={() => handleContactSelect(address)}
                >
                  <View className="contact-main">
                    <View className="contact-name-row">
                      <Text className="contact-name">{address.contact}</Text>
                      {address.isDefault && <Tag type="primary">默认</Tag>}
                    </View>
                    <Text className="contact-phone">{address.phone}</Text>
                  </View>
                  <View className="contact-address">
                    {address.street} {address.unit}
                  </View>
                </View>
              ))
            ) : (
              <View className="empty-address">
                <Text className="empty-text">暂无地址信息</Text>
              </View>
            )}
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
