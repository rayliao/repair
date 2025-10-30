import { View } from "@tarojs/components";
import ServiceListComponent from "../../components/ServiceList";
import "./index.scss";

function ServiceList() {
  return (
    <View className="service-list-page">
      <ServiceListComponent
        showSearch={true}
        className="full-height"
      />
    </View>
  );
}

export default ServiceList;
