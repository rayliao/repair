import { View } from "@tarojs/components";
import {
  SideBar,
  SideBarItem,
  SearchBar,
  Grid,
  Image,
  Empty,
} from "@nutui/nutui-react-taro";
import { useState, useMemo } from "react";
import { useGetApiServicesList } from "../../api/web-api/web-api";
import "./index.scss";

function Services() {
  const [searchText, setSearchText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 获取服务列表数据
  const { data: servicesList, isLoading, error } = useGetApiServicesList();

  // 处理服务分类数据
  const servicesData = useMemo(() => {
    try {
      const rawData = Array.isArray((servicesList as any)?.data)
        ? (servicesList as any).data
        : [];
      return rawData;
    } catch (e) {
      console.error("处理服务数据出错:", e);
      return [];
    }
  }, [servicesList]);

  // 获取当前选中的分类
  const currentCategory = servicesData[selectedIndex];

  // 获取当前分类下的服务列表
  // 如果有 subServices，则使用 subServices 中的服务；否则使用 services 字段
  const currentServices = useMemo(() => {
    if (!currentCategory) return [];

    // 优先使用 subServices 中的服务列表
    let services: any[] = [];

    if (
      currentCategory.subServices &&
      Array.isArray(currentCategory.subServices)
    ) {
      // subServices 是一个数组，每个元素包含 servicesSubName 和 services
      currentCategory.subServices.forEach((sub: any) => {
        if (Array.isArray(sub.services)) {
          services = services.concat(sub.services);
        }
      });
    } else if (
      currentCategory.services &&
      Array.isArray(currentCategory.services)
    ) {
      // 直接使用 services 字段
      services = currentCategory.services;
    }

    // 如果有搜索文本，则过滤服务
    if (searchText.trim()) {
      return services.filter((service: any) =>
        service.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return services;
  }, [currentCategory, searchText]);

  // 搜索处理
  const onSearch = (value: string) => {
    console.log("搜索内容:", value);
  };

  // 服务项点击
  const onServiceClick = (service: any) => {
    console.log("点击服务:", service);
    // TODO: 跳转到服务详情页
  };

  return (
    <View className="services-page">
      {/* 搜索框 */}
      <View className="search-section">
        <SearchBar
          value={searchText}
          onSearch={onSearch}
          onChange={setSearchText}
          placeholder="搜索服务"
          shape="round"
          clearable
        />
      </View>

      {/* 侧边栏 + 内容区域 */}
      <View className="services-content">
        {isLoading ? (
          <View className="loading-container">
            <Empty description="加载中..." />
          </View>
        ) : error ? (
          <View className="error-container">
            <Empty description="加载失败，请检查网络连接" />
          </View>
        ) : servicesData.length === 0 ? (
          <View className="empty-container">
            <Empty description="暂无服务分类数据" />
          </View>
        ) : (
          <>
            {/* 左侧侧边栏导航 */}
            <View className="sidebar-wrapper">
              <SideBar
                value={selectedIndex}
                onChange={(key) => {
                  setSelectedIndex(Number(key));
                  setSearchText(""); // 切换分类时清空搜索
                }}
              >
                {servicesData.map((category: any, index: number) => (
                  <SideBarItem
                    key={index}
                    title={category.name || `分类${index + 1}`}
                  />
                ))}
              </SideBar>
            </View>

            {/* 右侧内容区域 */}
            <View className="content-area">
              {currentServices.length > 0 ? (
                <View className="services-list">
                  <View className="category-title">
                    {currentCategory?.name || ""}
                  </View>
                  <Grid columns={3}>
                    {currentServices.map((service: any, index: number) => {
                      const imageUrl = service.logo
                        ? `http://106.55.142.137${service.logo}`
                        : null;

                      return (
                        <Grid.Item
                          square={false}
                          className="service-item"
                          key={index}
                          onClick={() => onServiceClick(service)}
                          text={service.name || "未知服务"}
                        >
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              width="100%"
                              height="80"
                              className="service-image"
                            />
                          ) : (
                            <View className="service-image-placeholder">
                              🔧
                            </View>
                          )}
                        </Grid.Item>
                      );
                    })}
                  </Grid>
                </View>
              ) : (
                <View className="no-results">
                  <Empty description="暂无服务数据" />
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

export default Services;
