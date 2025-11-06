import { View, Text } from "@tarojs/components";
import {
  Button,
  Form,
  FormItem,
  Input,
  Loading,
} from "@nutui/nutui-react-taro";
import {
  Location,
  User,
  Phone,
  Home,
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

  // 提交表单
  const handleSubmit = async () => {
    // 表单验证
    if (!formData.street.trim()) {
      Taro.showToast({
        title: "请填写街道/小区",
        icon: "none",
      });
      return;
    }

    if (!formData.unit.trim()) {
      Taro.showToast({
        title: "请填写楼号/门牌号",
        icon: "none",
      });
      return;
    }

    if (!formData.contact.trim()) {
      Taro.showToast({
        title: "请填写联系人",
        icon: "none",
      });
      return;
    }

    if (!formData.phone.trim()) {
      Taro.showToast({
        title: "请填写手机号",
        icon: "none",
      });
      return;
    }

    // 手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      Taro.showToast({
        title: "请填写正确的手机号",
        icon: "none",
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
          icon: "none",
        });
      } else {
        // 新增地址
        const addData: AddAddressDto = formData;
        await addAddress.trigger(addData);
        Taro.showToast({
          title: "添加成功",
          icon: "none",
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
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="address-add-page">
      <View className="form-container">
        <Form>
          {/* 街道/小区输入 */}
          <FormItem label="街道/小区" required>
            <View className="input-wrapper">
              <View className="input-icon">
                <Location size={16} color="#666" />
              </View>
              <Input
                placeholder="请填写街道/小区地址"
                value={formData.street}
                onChange={(value) =>
                  setFormData({ ...formData, street: value })
                }
                clearable
                className="input-field"
              />
            </View>
          </FormItem>

          {/* 楼号/门牌号 */}
          <FormItem label="楼号/门牌号" required>
            <View className="input-wrapper">
              <View className="input-icon">
                <Home size={16} color="#666" />
              </View>
              <Input
                placeholder="请填写楼号/门牌号"
                value={formData.unit}
                onChange={(value) =>
                  setFormData({ ...formData, unit: value })
                }
                clearable
                className="input-field"
              />
            </View>
          </FormItem>

          {/* 联系人 */}
          <FormItem label="联系人" required>
            <View className="input-wrapper">
              <View className="input-icon">
                <User size={16} color="#666" />
              </View>
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
              <View className="input-icon">
                <Phone size={16} color="#666" />
              </View>
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
