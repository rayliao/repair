import { View } from "@tarojs/components";
import {
  SearchBar,
  Picker,
  Swiper as NutSwiper,
  SwiperItem as NutSwiperItem,
  Grid,
  GridItem,
  Image,
  Empty
} from "@nutui/nutui-react-taro";
import { useState } from "react";
import { useGetApiWebInfo, useGetApiServicesList } from "../../api/web-api/web-api";

import "./index.scss";

// 城市选项
const CITY_OPTIONS = [
  { label: "全国", value: "all" },
  { label: "北京", value: "beijing" },
  { label: "上海", value: "shanghai" },
  { label: "广州", value: "guangzhou" },
  { label: "深圳", value: "shenzhen" },
  { label: "杭州", value: "hangzhou" }
];

function Index() {
  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState("全国");
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  // 使用 SWR hooks
  const { data: webInfo, isLoading: webLoading, error: webError } = useGetApiWebInfo();
  const { data: servicesList, isLoading: servicesLoading, error: servicesError } = useGetApiServicesList();

  // 调试信息 - 查看数据结构
  console.log('🔍 [Debug] webInfo:', webInfo);
  console.log('🔍 [Debug] servicesList:', servicesList);
  console.log('🔍 [Debug] webInfo type:', typeof webInfo);
  console.log('🔍 [Debug] servicesList type:', typeof servicesList);

  // 获取轮播图数据 - 修正数据路径
  const banners = (webInfo as any)?.data?.banner || [];
  console.log('🎪 [Debug] banners:', banners);

  // 获取服务列表数据 - 修正数据路径
  const servicesData = Array.isArray((servicesList as any)?.data)
    ? (servicesList as any).data
    : Array.isArray((servicesList as any)?.data?.list)
      ? (servicesList as any).data.list
      : [];

  // 如果没有服务数据，提供一些默认服务图标
  const services = servicesData.length > 0 ? servicesData : [
    { name: "家电维修", icon: "🔧" },
    { name: "水电维修", icon: "💧" },
    { name: "空调维修", icon: "❄️" },
    { name: "洗衣机维修", icon: "🔄" },
    { name: "冰箱维修", icon: "🧊" },
    { name: "热水器维修", icon: "🔥" },
    { name: "管道疏通", icon: "🚿" },
    { name: "门窗维修", icon: "🚪" },
    { name: "其他服务", icon: "🛠" }
  ];
  console.log('🛠 [Debug] services:', services);

  // 城市选择器确认
  const onCityConfirm = (options: any) => {
    setSelectedCity(options[0]?.label || "全国");
    setCityPickerVisible(false);
  };

  // 搜索处理
  const onSearch = (value: string) => {
    console.log('搜索内容:', value);
    // TODO: 实现搜索逻辑
  };

  // 服务项点击
  const onServiceClick = (service: any) => {
    console.log('点击服务:', service);
    // TODO: 跳转到服务详情页
  };

  return (
    <View className="index-page">
      {/* 搜索栏和城市选择 */}
      <View className="search-header">
        <View className="search-row">
          <View className="city-selector" onClick={() => setCityPickerVisible(true)}>
            <View className="city-text">{selectedCity}</View>
            <View className="city-arrow">▼</View>
          </View>

          <View className="search-container">
            <SearchBar
              value={searchText}
              placeholder="搜索维修服务"
              onChange={setSearchText}
              onSearch={onSearch}
            />
          </View>
        </View>
      </View>

      {/* 城市选择器 */}
      <Picker
        visible={cityPickerVisible}
        options={[CITY_OPTIONS]}
        onClose={() => setCityPickerVisible(false)}
        onConfirm={onCityConfirm}
        title="选择城市"
      />

      {/* 轮播图 */}
      {banners.length > 0 ? (
        <View className="banner-section">
          <NutSwiper
            autoPlay
            interval={3000}
            indicator
            indicatorColor="#f0f0f0"
            indicatorActiveColor="#fa2c19"
            height="200"
          >
            {banners.map((bannerUrl: string, index: number) => (
              <NutSwiperItem key={index}>
                <View className="banner-item">
                  <Image
                    src={`http://106.55.142.137${bannerUrl}`}
                    width="100%"
                    height="200"
                    fit="cover"
                    alt={`轮播图${index + 1}`}
                  />
                </View>
              </NutSwiperItem>
            ))}
          </NutSwiper>
        </View>
      ) : null}

      {/* 服务列表 */}
      <View className="services-section">
        <View className="section-title">热门服务</View>

        {services.length > 0 ? (
          <Grid columns={3} gap={10}>
            {services.slice(0, 9).map((service: any, index: number) => (
              <GridItem key={index} onClick={() => onServiceClick(service)}>
                <View className="service-item">
                  <View className="service-icon">{service.icon || "🔧"}</View>
                  <View className="service-name">
                    {service.name || service.title || `服务${index + 1}`}
                  </View>
                </View>
              </GridItem>
            ))}
          </Grid>
        ) : !servicesLoading && (
          <Empty description="暂无服务数据" />
        )}
      </View>

      {/* 错误状态 */}
      {(webError || servicesError) && !webLoading && !servicesLoading && (
        <View className="error-container">
          <Empty description="加载失败，请检查网络连接" />
        </View>
      )}
    </View>
  );
}

export default Index;
