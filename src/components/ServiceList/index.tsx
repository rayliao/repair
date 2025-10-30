import { View } from "@tarojs/components";
import {
  SideBar,
  SideBarItem,
  SearchBar,
  Grid,
  Image,
  Empty,
} from "@nutui/nutui-react-taro";
import { useState, useMemo, useEffect } from "react";
import Taro from "@tarojs/taro";
import { useGetApiServicesList } from "../../api/web-api/web-api";
import "./index.module.scss";

interface ServiceListComponentProps {
  /** 初始选中的分类名称（可选） */
  initialCategory?: string;
  /** 是否显示搜索框 */
  showSearch?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 服务项点击回调 */
  onServiceClick?: (service: any) => void;
}

function ServiceListComponent({
  initialCategory,
  showSearch = true,
  className = "",
  onServiceClick,
}: ServiceListComponentProps) {
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

  // 根据初始分类参数自动选中对应分类
  useEffect(() => {
    if (initialCategory && servicesData.length > 0) {
      const categoryIndex = servicesData.findIndex((category: any) =>
        category.name === initialCategory
      );
      if (categoryIndex !== -1) {
        setSelectedIndex(categoryIndex);
        console.log(`🎯 自动选中分类: ${initialCategory}, 索引: ${categoryIndex}`);
      }
    }
  }, [initialCategory, servicesData]);

  // 获取当前选中的分类
  const currentCategory = servicesData[selectedIndex];

  // 获取当前分类下的服务列表
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

  // 默认服务项点击处理
  const handleServiceClick = (service: any) => {
    if (onServiceClick) {
      onServiceClick(service);
    } else {
      // 默认行为：跳转到服务详情页
      console.log("点击服务:", service);
      if (service.id) {
        Taro.navigateTo({
          url: `/pages/service-detail/index?id=${service.id}`
        });
      } else {
        Taro.showToast({
          title: "服务信息异常",
          icon: "error"
        });
      }
    }
  };

  return (
    <View className={`service-list-component ${className}`}>
      {/* 搜索框 */}
      {showSearch && (
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
      )}

      {/* 侧边栏 + 内容区域 */}
      <View className="services-content">
        {isLoading ? (
          <View className="loading-container">
            <Empty description="加载中..." />
          </View>
        ) : error ? (
          <View className="error-container">
            <Empty description="加载失败，请重试" />
          </View>
        ) : servicesData.length === 0 ? (
          <View className="empty-container">
            <Empty description="暂无服务数据" />
          </View>
        ) : (
          <>
            {/* 左侧分类导航 */}
            <View className="sidebar-container">
              <SideBar value={selectedIndex} onChange={(index) => setSelectedIndex(Number(index))}>
                {servicesData.map((category: any, index: number) => (
                  <SideBarItem
                    key={index}
                    title={category.name || "未知分类"}
                    value={index}
                  />
                ))}
              </SideBar>
            </View>

            {/* 右侧服务内容 */}
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
                          onClick={() => handleServiceClick(service)}
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

export default ServiceListComponent;
