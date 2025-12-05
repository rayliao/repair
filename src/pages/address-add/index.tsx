import { View, Text } from "@tarojs/components";
import {
  Button,
  Form,
  FormItem,
  Input,
  Loading,
  TextArea,
} from "@nutui/nutui-react-taro";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import {
  usePostAddressAdd,
  usePostAddressEdit,
  useGetAddressInfo,
} from "../../api/address-api/address-api";
import type { AddAddressDto, EditAddressDto } from "../../api/model";
import { useAuth } from "../../utils/useAuth";
import "./index.scss";

const AddressAdd = () => {
  // 登录鉴权
  const { isLogin } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 使用 Form.useForm 管理表单
  const [form] = Form.useForm();

  // API hooks
  const addAddress = usePostAddressAdd();
  const editAddress = usePostAddressEdit();

  // 获取地址详情
  const { data: addressInfo } = useGetAddressInfo(
    addressId ? { id: addressId } : undefined,
    { swr: { enabled: !!addressId } }
  );

  useEffect(() => {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params;
    if (params?.mode === "edit" && params?.id) {
      setIsEdit(true);
      setAddressId(Number(params.id));
    }
  }, []);

  // 填充编辑表单数据
  useEffect(() => {
    if (addressInfo?.data) {
      const formValues = {
        street: addressInfo.data.street || "",
        unit: addressInfo.data.unit || "",
        contact: addressInfo.data.contact || "",
        phone: addressInfo.data.phone || "",
      };
      // 使用 form.setFieldsValue 设置表单值
      form.setFieldsValue(formValues);
    }
  }, [addressInfo, form]);

  // 提交表单
  const handleSubmit = async () => {
    try {
      // 验证表单
      const validationResult = await form.validateFields();

      // 如果有验证错误，显示第一个错误信息
      if (validationResult && validationResult.length > 0) {
        const firstError = validationResult[0];
        Taro.showToast({
          title: firstError.message || "表单验证失败",
          icon: "none",
        });
        return;
      }

      // 验证通过，获取表单的所有值
      const values = form.getFieldsValue(true);
      console.log("表单验证成功:", values);

      setLoading(true);

      let result;
      if (isEdit && addressId) {
        // 编辑地址
        const editData: EditAddressDto = {
          ...values,
          id: addressId,
        };
        result = await editAddress.trigger(editData);
        // 判断接口返回结果
        if (result?.code === 0) {
          // 返回上一页
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
        Taro.showToast({
          title: result?.message,
          icon: "none",
        });
      } else {
        // 新增地址
        const addData: AddAddressDto = values;
        result = await addAddress.trigger(addData);
        // 判断接口返回结果
        if (result?.code === 0) {
          // 返回上一页
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
        Taro.showToast({
          title: result?.message,
          icon: "none",
        });
      }
    } catch (error: any) {
      console.error("保存地址失败:", error);

      // 显示具体的错误信息
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        (isEdit ? "修改失败" : "添加失败");
      Taro.showToast({
        title: errorMessage,
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  // 如果未登录，不渲染页面内容
  if (!isLogin) {
    return null;
  }

  return (
    <View className="address-add-page">
      <View className="form-container">
        <Form form={form}>
          {/* 街道/小区输入 */}
          <FormItem
            label="街道/小区"
            name="street"
            required
            rules={[
              { required: true, message: "请填写街道/小区地址" },
              { max: 200, message: "地址不能超过200个字符" },
            ]}
          >
            <TextArea
              placeholder="请填写街道/小区地址"
              className="textarea-field"
              rows={3}
              maxLength={200}
              showCount
            />
          </FormItem>

          {/* 楼号/门牌号 */}
          <FormItem
            label="楼号/门牌号"
            name="unit"
            required
            rules={[
              { required: true, message: "请填写楼号/门牌号" },
              { max: 50, message: "楼号/门牌号不能超过50个字符" },
            ]}
          >
            <Input
              placeholder="请填写楼号/门牌号"
              clearable
              className="input-field"
            />
          </FormItem>

          {/* 联系人 */}
          <FormItem
            label="联系人"
            name="contact"
            required
            rules={[
              { required: true, message: "请填写联系人姓名" },
              { max: 20, message: "联系人姓名不能超过20个字符" },
            ]}
          >
            <Input
              placeholder="请填写联系人姓名"
              clearable
              className="input-field"
            />
          </FormItem>

          {/* 手机号 */}
          <FormItem
            label="手机号"
            name="phone"
            required
            rules={[
              { required: true, message: "请填写手机号" },
              { pattern: /^1[3-9]\d{9}$/, message: "请填写正确的手机号格式" },
            ]}
          >
            <Input
              placeholder="请填写联系人手机号"
              type="tel"
              maxLength={11}
              clearable
              className="input-field"
            />
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
            <Text className="btn-text">{isEdit ? "保存修改" : "添加地址"}</Text>
          )}
        </Button>
      </View>
    </View>
  );
};

export default AddressAdd;
