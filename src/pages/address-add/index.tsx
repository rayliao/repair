import { View, Text } from "@tarojs/components";
import {
  Button,
  Form,
  FormItem,
  Input,
  Cell,
  Loading,
} from "@nutui/nutui-react-taro";
import {
  Location,
  ArrowRight,
  User,
  Phone,
} from "@nutui/icons-react-taro";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import {
  usePostAddressAdd,
  usePostAddressEdit,
} from "../../api/address-api/address-api";
import type { AddAddressDto, EditAddressDto } from "../../api/model";
import "./index.scss";

const AddressAdd = () => {
  const [formData, setFormData] = useState({
    street: "",
    unit: "",
    contact: "",
    phone: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // API hooks
  const addAddress = usePostAddressAdd();
  const editAddress = usePostAddressEdit();

  useEffect(() => {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params;
    if (params?.mode === "edit" && params?.id) {
      setIsEdit(true);
      setAddressId(Number(params.id));
      // 这里可以加载地址详情进行编辑
      // TODO: 加载地址详情
    }
  }, []);

  // 选择街道/小区位置
  const handleSelectLocation = () => {
    Taro.navigateTo({
      url: "/pages/location-picker/index",
    }).then(() => {
      // 监听页面返回事件
      Taro.eventCenter.once("locationSelected", (location) => {
        setFormData({
          ...formData,
          street: location.address,
        });
      });
    });
  };

  // 提交表单
  const handleSubmit = async () => {
    // 表单验证
    if (!formData.street.trim()) {
      Taro.showToast({
        title: "请选择街道/小区",
        icon: "error",
      });
      return;
    }

    if (!formData.unit.trim()) {
      Taro.showToast({
        title: "请填写楼号/门牌号",
        icon: "error",
      });
      return;
    }

    if (!formData.contact.trim()) {
      Taro.showToast({
        title: "请填写联系人",
        icon: "error",
      });
      return;
    }

    if (!formData.phone.trim()) {
      Taro.showToast({
        title: "请填写手机号",
        icon: "error",
      });
      return;
    }

    // 手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      Taro.showToast({
        title: "请填写正确的手机号",
        icon: "error",
      });
      return;
    }

    try {
      setLoading(true);

      if (isEdit && addressId) {
        // 编辑地址
        const editData: EditAddressDto = {
          ...formData,
          id: addressId,
        };
        await editAddress.trigger(editData);
        Taro.showToast({
          title: "修改成功",
          icon: "success",
        });
      } else {
        // 新增地址
        const addData: AddAddressDto = formData;
        await addAddress.trigger(addData);
        Taro.showToast({
          title: "添加成功",
          icon: "success",
        });
      }

      // 返回上一页
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error("保存地址失败:", error);
      Taro.showToast({
        title: isEdit ? "修改失败" : "添加失败",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="address-add-page">
      <View className="form-container">
        <Form>
          {/* 街道/小区选择 */}
          <FormItem label="街道/小区" required>
            <Cell
              className="location-cell"
              onClick={handleSelectLocation}
            >
              <View className="location-content">
                <Location size={16} color="#d81e06" />
                <Text className="location-text">
                  {formData.street || "请选择街道/小区位置"}
                </Text>
                <ArrowRight size={16} color="#999" />
              </View>
            </Cell>
          </FormItem>

          {/* 楼号/门牌号 */}
          <FormItem label="楼号/门牌号" required>
            <Input
              placeholder="请填写楼号/门牌号"
              value={formData.unit}
              onChange={(value) =>
                setFormData({ ...formData, unit: value })
              }
              clearable
            />
          </FormItem>

          {/* 联系人 */}
          <FormItem label="联系人" required>
            <View className="input-wrapper">
              <User size={16} color="#999" />
              <Input
                placeholder="请填写联系人姓名"
                value={formData.contact}
                onChange={(value) =>
                  setFormData({ ...formData, contact: value })
                }
                clearable
                className="input-field"
              />
            </View>
          </FormItem>

          {/* 手机号 */}
          <FormItem label="手机号" required>
            <View className="input-wrapper">
              <Phone size={16} color="#999" />
              <Input
                placeholder="请填写联系人手机号"
                value={formData.phone}
                type="tel"
                maxLength={11}
                onChange={(value) =>
                  setFormData({ ...formData, phone: value })
                }
                clearable
                className="input-field"
              />
            </View>
          </FormItem>
        </Form>
      </View>

      {/* 底部提交按钮 */}
      <View className="bottom-actions">
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          className="submit-btn"
          block
        >
          {loading ? (
            <Loading type="spinner" />
          ) : (
            <Text className="btn-text">
              {isEdit ? "保存修改" : "添加地址"}
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
};

export default AddressAdd;
