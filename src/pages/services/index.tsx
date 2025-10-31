import { View } from "@tarojs/components";
import ServiceListComponent from "../../components/ServiceList";
import "./index.scss";

function Services() {
  return (
    <View className="services-page">
      <ServiceListComponent showSearch={true} className="full-height" />
    </View>
  );
}

export default Services;
