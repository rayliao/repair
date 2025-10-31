import { View, Text, Map } from "@tarojs/components";
import {
  Button,
  Input,
  Loading,
  Cell,
} from "@nutui/nutui-react-taro";
import {
  Location,
  Search,
} from "@nutui/icons-react-taro";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";

interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

const LocationPicker = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>({
    latitude: 39.908691,
    longitude: 116.397446,
    address: "",
    name: "",
  });
  const [searchText, setSearchText] = useState("");
  const [nearbyPlaces, setNearbyPlaces] = useState<LocationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);

  // 获取当前位置
  const getCurrentLocation = () => {
    setLoading(true);
    Taro.getLocation({
      type: "gcj02",
      success: (res) => {
        const location: LocationInfo = {
          latitude: res.latitude,
          longitude: res.longitude,
          address: "当前位置",
          name: "当前位置",
        };
        setCurrentLocation(location);
        setSelectedLocation(location);
        // 获取附近地点
        getNearbyPlaces(res.latitude, res.longitude);
      },
      fail: (error) => {
        console.error("获取位置失败:", error);
        Taro.showToast({
          title: "获取位置失败",
          icon: "error",
        });
        setLoading(false);
      },
    });
  };

  // 获取附近地点（模拟数据）
  const getNearbyPlaces = (lat: number, lng: number) => {
    // 这里应该调用地图API获取附近地点
    // 现在使用模拟数据
    const mockPlaces: LocationInfo[] = [
      {
        latitude: lat + 0.001,
        longitude: lng + 0.001,
        address: "中关村大街1号",
        name: "中关村广场",
      },
      {
        latitude: lat + 0.002,
        longitude: lng - 0.001,
        address: "海淀区中关村南大街2号",
        name: "鼎好大厦",
      },
      {
        latitude: lat - 0.001,
        longitude: lng + 0.002,
        address: "海淀区中关村大街27号",
        name: "中关村e世界",
      },
      {
        latitude: lat + 0.003,
        longitude: lng + 0.001,
        address: "海淀区中关村大街甲1号",
        name: "欧美汇购物中心",
      },
      {
        latitude: lat - 0.002,
        longitude: lng - 0.002,
        address: "海淀区知春路108号",
        name: "豪景大厦",
      },
    ];

    setNearbyPlaces(mockPlaces);
    setLoading(false);
  };

  // 地图点击事件
  const handleMapTap = (event: any) => {
    const { latitude, longitude } = event.detail;
    const location: LocationInfo = {
      latitude,
      longitude,
      address: `经度:${longitude.toFixed(6)}, 纬度:${latitude.toFixed(6)}`,
      name: "选中位置",
    };
    setSelectedLocation(location);
  };

  // 搜索地点
  const handleSearch = () => {
    if (!searchText.trim()) {
      return;
    }

    // 这里应该调用地图搜索API
    // 现在使用模拟搜索
    const mockSearchResults: LocationInfo[] = [
      {
        latitude: currentLocation.latitude + 0.01,
        longitude: currentLocation.longitude + 0.01,
        address: searchText + "附近",
        name: searchText + "相关地点1",
      },
      {
        latitude: currentLocation.latitude - 0.01,
        longitude: currentLocation.longitude - 0.01,
        address: searchText + "周边",
        name: searchText + "相关地点2",
      },
    ];

    setNearbyPlaces(mockSearchResults);
  };

  // 选择地点
  const handleSelectPlace = (place: LocationInfo) => {
    setSelectedLocation(place);
    setCurrentLocation(place);
  };

  // 确认选择
  const handleConfirm = () => {
    if (!selectedLocation) {
      Taro.showToast({
        title: "请选择一个位置",
        icon: "error",
      });
      return;
    }

    // 通过事件中心传递选中的位置
    Taro.eventCenter.trigger("locationSelected", {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: selectedLocation.address,
      name: selectedLocation.name,
    });

    // 返回上一页
    Taro.navigateBack();
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View className="location-picker-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input">
          <Search size={16} color="#999" />
          <Input
            placeholder="搜索地点"
            value={searchText}
            onChange={setSearchText}
            onConfirm={handleSearch}
            className="search-field"
          />
        </View>
        <Button size="small" type="primary" onClick={handleSearch}>
          搜索
        </Button>
      </View>

      {/* 地图区域 */}
      <View className="map-container">
        <Map
          longitude={currentLocation.longitude}
          latitude={currentLocation.latitude}
          scale={16}
          markers={selectedLocation ? [{
            id: 1,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            title: selectedLocation.name,
            iconPath: "/images/logo.png",
            width: 30,
            height: 30,
          }] : []}
          onTap={handleMapTap}
          onError={(error) => {
            console.error("地图加载错误:", error);
          }}
          className="map"
        />

        {/* 当前选中位置信息 */}
        {selectedLocation && (
          <View className="selected-location">
            <Location size={16} color="#d81e06" />
            <View className="location-info">
              <Text className="location-name">{selectedLocation.name}</Text>
              <Text className="location-address">{selectedLocation.address}</Text>
            </View>
          </View>
        )}
      </View>

      {/* 附近地点列表 */}
      <View className="places-list">
        <View className="list-header">
          <Text className="header-title">附近地点</Text>
          <Button
            size="small"
            onClick={getCurrentLocation}
            className="relocate-btn"
          >
            <Location size={14} />
            <Text className="btn-text">重新定位</Text>
          </Button>
        </View>

        {loading ? (
          <View className="loading-container">
            <Loading />
            <Text className="loading-text">加载中...</Text>
          </View>
        ) : (
          <View className="places">
            {nearbyPlaces.map((place, index) => (
              <Cell
                key={index}
                className={`place-item ${
                  selectedLocation?.latitude === place.latitude &&
                  selectedLocation?.longitude === place.longitude
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleSelectPlace(place)}
              >
                <View className="place-content">
                  <View className="place-info">
                    <Text className="place-name">{place.name}</Text>
                    <Text className="place-address">{place.address}</Text>
                  </View>
                  {selectedLocation?.latitude === place.latitude &&
                    selectedLocation?.longitude === place.longitude && (
                    <View className="selected-icon">
                      <Location size={16} color="#d81e06" />
                    </View>
                  )}
                </View>
              </Cell>
            ))}
          </View>
        )}
      </View>

      {/* 底部确认按钮 */}
      <View className="bottom-actions">
        <Button
          type="primary"
          onClick={handleConfirm}
          disabled={!selectedLocation}
          className="confirm-btn"
          block
        >
          <Text className="btn-text">确认选择</Text>
        </Button>
      </View>
    </View>
  );
};

export default LocationPicker;
