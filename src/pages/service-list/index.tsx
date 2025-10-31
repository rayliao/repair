import { View } from "@tarojs/components";
import ServiceListComponent from "../../components/ServiceList";
import "./index.scss";
import Taro from "@tarojs/taro";

function ServiceList() {
  // 获取路由参数
  const params = Taro.getCurrentInstance().router?.params;
  const categoryParam = params?.category
    ? decodeURIComponent(params.category)
    : undefined;
  return (
    <View className="service-list-page">
      <ServiceListComponent showSearch={true} className="full-height" initialCategory={categoryParam} />
    </View>
  );
}

export default ServiceList;
