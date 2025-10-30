import { View, Image } from "@tarojs/components";
import {
  Elevator,
  Swiper as NutSwiper,
  SwiperItem as NutSwiperItem,
  Grid,
  Empty,
  Popup,
  SearchBar,
  Button,
} from "@nutui/nutui-react-taro";
import { useState, useMemo } from "react";
import Taro from "@tarojs/taro";
import {
  useGetApiWebInfo,
  useGetApiServicesList,
  useGetApiCityList,
} from "../../api/web-api/web-api";
import logo from "../../images/logo.png";
import "./index.scss";
import { host } from "../../utils/config";

function Index() {
  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState("全国");
  const [elevatorVisible, setElevatorVisible] = useState(false);

  // 获取系统信息中的状态栏高度
  const statusBarHeight = useMemo(() => {
    const systemInfo = Taro.getSystemInfoSync();
    return systemInfo.statusBarHeight || 0;
  }, []);

  // 使用 SWR hooks
  const {
    data: webInfo,
    isLoading: webLoading,
    error: webError,
  } = useGetApiWebInfo();
  const {
    data: servicesList,
    isLoading: servicesLoading,
    error: servicesError,
  } = useGetApiServicesList();
  const { data: cityList } = useGetApiCityList();

  // 获取轮播图数据 - 修正数据路径
  const bannersArray: any[] = Array.isArray((webInfo as any)?.data?.banner)
    ? (webInfo as any).data.banner
    : [];

  const banners = bannersArray as string[];

  // 获取服务列表数据 - 修正数据路径
  const servicesData = Array.isArray((servicesList as any)?.data)
    ? (servicesList as any).data
    : Array.isArray((servicesList as any)?.data?.list)
    ? (servicesList as any).data.list
    : [];

  // 如果没有服务数据，提供一些默认服务图标
  const services =
    servicesData.length > 0
      ? servicesData
      : [
          { name: "家电维修", icon: "🔧" },
          { name: "水电维修", icon: "💧" },
          { name: "空调维修", icon: "❄️" },
          { name: "洗衣机维修", icon: "🔄" },
          { name: "冰箱维修", icon: "🧊" },
          { name: "热水器维修", icon: "🔥" },
          { name: "管道疏通", icon: "🚿" },
          { name: "门窗维修", icon: "🚪" },
          { name: "其他服务", icon: "🛠" },
        ];

  // 处理城市数据 - 为 Elevator 格式化
  const rawCities = Array.isArray((cityList as any)?.data)
    ? (cityList as any).data
    : Array.isArray(cityList)
    ? (cityList as any)
    : [
        { name: "全国", id: "all" },
        { name: "北京", id: "beijing" },
        { name: "上海", id: "shanghai" },
        { name: "广州", id: "guangzhou" },
        { name: "深圳", id: "shenzhen" },
        { name: "杭州", id: "hangzhou" },
        { name: "苏州", id: "suzhou" },
        { name: "成都", id: "chengdu" },
        { name: "武汉", id: "wuhan" },
        { name: "西安", id: "xian" },
        { name: "长沙", id: "changsha" },
        { name: "青岛", id: "qingdao" },
      ];
  // 为 Elevator 格式化城市数据
  const elevatorData = [
    {
      title: "城市列表",
      list: rawCities.map((city: any, index: number) => {
        // 处理城市数据，city 可能是字符串或对象
        const cityName =
          typeof city === "string" ? city : city?.name || "未知城市";
        return {
          name: cityName,
          id: `city_${index}`,
          key: `city_${index}`,
        };
      }),
    },
  ];

  // 城市选择处理
  const onCitySelect = (item: any) => {
    setSelectedCity(item.name);
    setElevatorVisible(false);
  };

  // 搜索处理
  const onSearch = (value: string) => {
    console.log("搜索内容:", value);
    // TODO: 实现搜索逻辑
  };

  // 服务项点击
  const onServiceClick = (service: any) => {
    // 跳转到服务页面，传递服务id作为默认选中分类
    Taro.navigateTo({
      url: `/pages/service-list/index?category=${encodeURIComponent(
        service.id || ""
      )}`,
    });
  };

  // 轮播图渲染
  const bannerContent =
    banners && banners.length > 0 ? (
      <View className="banner-section">
        <NutSwiper
          indicator
          interval={3000}
          indicatorColor="#f0f0f0"
          indicatorActiveColor="#fa2c19"
          height="200"
        >
          {banners.map((bannerUrl: string, index: number) => (
            <NutSwiperItem key={index}>
              <View className="banner-item">
                <Image src={`${host}${bannerUrl}`} />
              </View>
            </NutSwiperItem>
          ))}
        </NutSwiper>
      </View>
    ) : null;

  return (
    <View className="index-page">
      {/* 自定义头部 - 内联 Header 组件 */}
      <View
        className="header-container"
        style={{ paddingTop: `${statusBarHeight}px` }}
      >
        {/* 标题行 */}
        <View className="header-title-row">
          <Image src={logo} className="header-logo" mode="scaleToFill" />
          <View className="header-title">关师傅维修</View>
        </View>

        {/* 搜索栏行 */}
        <View className="header-search-row">
          {/* SearchBar 搜索框 - 城市选择在 leftIn，搜索按钮在 rightIn */}
          <View className="search-bar-wrapper">
            <SearchBar
              className="header-search-bar"
              value={searchText}
              placeholder="搜索维修服务"
              onChange={setSearchText}
              onSearch={onSearch}
              shape="round"
              maxLength={50}
              clearable
              leftIn={
                <View
                  className="city-selector"
                  onClick={() => setElevatorVisible(true)}
                >
                  <View className="city-text">{selectedCity}</View>
                  <View className="city-icon">▼</View>
                </View>
              }
              rightIn={
                <Button
                  className="search-button"
                  type="primary"
                  size="small"
                  onClick={() => onSearch(searchText)}
                >
                  搜索
                </Button>
              }
            />
          </View>
        </View>
      </View>

      {/* 城市选择器 - 使用 Elevator + Popup */}
      <Popup
        visible={elevatorVisible}
        position="bottom"
        onClose={() => setElevatorVisible(false)}
        closeable
        style={{ height: "60vh" }}
      >
        <View style={{ padding: "10px 0" }}>
          <Elevator
            list={elevatorData}
            height="auto"
            onItemClick={onCitySelect}
          />
        </View>
      </Popup>

      {bannerContent as any}

      {/* 服务列表 */}
      <View className="services-section">
        <View className="section-header">
          <View className="section-title">热门服务</View>
        </View>
        {services.length > 0 ? (
          <Grid>
            {services.map((service: any, index: number) => {
              // 拼接图片地址
              const imageUrl =
                service.icon || service.logo
                  ? `${host}${service.icon || service.logo}`
                  : null;

              return (
                <Grid.Item
                  className="service-item"
                  key={index}
                  onClick={() => onServiceClick(service)}
                  text={service.name || "未知服务"}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      mode="scaleToFill"
                      className="service-icon-image"
                    />
                  ) : (
                    <View className="service-icon">
                      {service.name?.charAt(0) || "🔧"}
                    </View>
                  )}
                </Grid.Item>
              );
            })}
          </Grid>
        ) : (
          !servicesLoading && <Empty description="暂无服务数据" />
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
