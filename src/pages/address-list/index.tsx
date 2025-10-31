import { View, Text } from "@tarojs/components";
import {
  Button,
  Empty,
  Tag,
  Loading,
} from "@nutui/nutui-react-taro";
import {
  Location,
  Plus,
  Del,
  Edit,
  User,
  Phone,
  Star,
  StarFill,
} from "@nutui/icons-react-taro";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import {
  usePostAddressList,
  usePostAddressDelete,
  usePostAddressSetDefault,
} from "../../api/address-api/address-api";
import type { Address } from "../../api/model/address";
import "./index.scss";

const AddressList = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // API hooks
  const addressList = usePostAddressList();
  const deleteAddress = usePostAddressDelete();
  const setDefaultAddress = usePostAddressSetDefault();

  // 加载地址列表
  const loadAddresses = async () => {
    try {
      setLoading(true);
      const result = await addressList.trigger();
      if (result?.data) {
        setAddresses(result.data);
      }
    } catch (error) {
      console.error("加载地址列表失败:", error);
      Taro.showToast({
        title: "加载失败",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // 新增地址
  const handleAddAddress = () => {
    Taro.navigateTo({
      url: "/pages/address-add/index",
    });
  };

  // 编辑地址
  const handleEditAddress = (address: Address) => {
    Taro.navigateTo({
      url: `/pages/address-add/index?id=${address.id}&mode=edit`,
    });
  };

  // 删除地址
  const handleDeleteAddress = async (address: Address) => {
    if (!address.id) return;

    try {
      await deleteAddress.trigger({ id: address.id });
      Taro.showToast({
        title: "删除成功",
        icon: "success",
      });
      loadAddresses();
    } catch (error) {
      console.error("删除地址失败:", error);
      Taro.showToast({
        title: "删除失败",
        icon: "error",
      });
    }
  };

  // 设置默认地址
  const handleSetDefault = async (address: Address) => {
    if (!address.id || address.isDefault) return;

    try {
      await setDefaultAddress.trigger({ id: address.id });
      Taro.showToast({
        title: "设置成功",
        icon: "success",
      });
      loadAddresses();
    } catch (error) {
      console.error("设置默认地址失败:", error);
      Taro.showToast({
        title: "设置失败",
        icon: "error",
      });
    }
  };

  // 显示操作菜单（暂时不需要）
  const showAddressActions = (address: Address) => {
    // 可以在这里添加点击地址卡片的逻辑
    console.log("点击了地址:", address);
  };

  if (loading) {
    return (
      <View className="address-list-page">
        <View className="loading-container">
          <Loading direction="vertical" />
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="address-list-page">
      {addresses.length === 0 ? (
        <View className="empty-container">
          <Empty description="暂无地址">
            <Button
              type="primary"
              onClick={handleAddAddress}
              className="add-address-btn"
            >
              <Plus size={16} />
              <Text className="btn-text">添加地址</Text>
            </Button>
          </Empty>
        </View>
      ) : (
        <View className="address-list">
          {addresses.map((address) => (
            <View key={address.id} className="address-card">
              <View
                className={`address-item ${
                  address.isDefault ? "default-address" : ""
                }`}
                onClick={() => showAddressActions(address)}
              >
                <View className="address-content">
                  <View className="address-header">
                    <View className="contact-info">
                      <User size={14} color="#333" />
                      <Text className="contact-name">{address.contact}</Text>
                      <Phone size={14} color="#666" />
                      <Text className="contact-phone">{address.phone}</Text>
                    </View>
                    <View className="default-tag">
                      {address.isDefault ? (
                        <>
                          <StarFill size={14} color="#d81e06" />
                          <Tag type="primary">默认</Tag>
                        </>
                      ) : (
                        <Star size={14} color="#ccc" />
                      )}
                    </View>
                  </View>
                  <View className="address-detail">
                    <Location size={14} color="#666" />
                    <Text className="address-text">
                      {address.street}
                      {address.unit && ` ${address.unit}`}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 操作按钮 */}
              <View className="address-actions">
                <Button
                  size="small"
                  onClick={() => handleEditAddress(address)}
                  className="action-btn edit-btn"
                >
                  <Edit size={14} />
                  <Text className="btn-text">编辑</Text>
                </Button>
                {!address.isDefault && (
                  <Button
                    size="small"
                    onClick={() => handleSetDefault(address)}
                    className="action-btn default-btn"
                  >
                    <Star size={14} />
                    <Text className="btn-text">设为默认</Text>
                  </Button>
                )}
                <Button
                  size="small"
                  onClick={() => {
                    Taro.showModal({
                      title: "确认删除",
                      content: "确定要删除这个地址吗？",
                      success: (res) => {
                        if (res.confirm) {
                          handleDeleteAddress(address);
                        }
                      },
                    });
                  }}
                  className="action-btn delete-btn"
                >
                  <Del size={14} />
                  <Text className="btn-text">删除</Text>
                </Button>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 底部添加按钮 */}
      {addresses.length > 0 && (
        <View className="bottom-actions">
          <Button
            type="primary"
            onClick={handleAddAddress}
            className="add-address-btn"
            block
          >
            <Plus size={16} />
            <Text className="btn-text">添加新地址</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default AddressList;
