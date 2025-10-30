import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import ServiceListComponent from "../../components/ServiceList";
import "./index.scss";

function Services() {
  // 获取路由参数
  const params = Taro.getCurrentInstance().router?.params;
  const categoryParam = params?.category ? decodeURIComponent(params.category) : undefined;

  return (
    <View className="services-page">
      <ServiceListComponent
        initialCategory={categoryParam}
        showSearch={true}
        className="full-height"
      />
    </View>
  );
}

export default Services;
