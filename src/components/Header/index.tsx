import { View, Image } from "@tarojs/components";
import { useMemo } from "react";
import Taro from "@tarojs/taro";
import { SearchBar, Button } from "@nutui/nutui-react-taro";
import logo from "../../images/logo.png";
import "./index.scss";

interface HeaderProps {
  title?: string;
  onSearch?: (value: string) => void;
  onCitySelect?: () => void;
  selectedCity?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

function Header({
  title = "关师傅维修",
  onSearch,
  onCitySelect,
  selectedCity = "全国",
  searchValue = "",
  onSearchChange,
}: HeaderProps) {
  // 获取系统信息中的状态栏高度
  const statusBarHeight = useMemo(() => {
    const systemInfo = Taro.getSystemInfoSync();
    return systemInfo.statusBarHeight || 0;
  }, []);

  return (
    <View className="header-container" style={{ paddingTop: `${statusBarHeight}px` }}>
      {/* 标题行 */}
      <View className="header-title-row">
        <Image
          src={logo}
          className="header-logo"
        />
        <View className="header-title">{title}</View>
      </View>

      {/* 搜索栏行 */}
      <View className="header-search-row">
        {/* SearchBar 搜索框 - 城市选择在 leftIn，搜索按钮在 rightIn */}
        <View className="search-bar-wrapper">
          <SearchBar
            className="header-search-bar"
            value={searchValue}
            placeholder="搜索维修服务"
            onChange={onSearchChange}
            onSearch={onSearch}
            shape="round"
            maxLength={50}
            clearable
            leftIn={
              <View className="city-selector" onClick={onCitySelect}>
                <View className="city-text">{selectedCity}</View>
                <View className="city-icon">▼</View>
              </View>
            }
            rightIn={
              <Button
                className="search-button"
                type="primary"
                size="small"
                onClick={() => onSearch?.(searchValue)}
              >
                搜索
              </Button>
            }
          />
        </View>
      </View>
    </View>
  );
}

export default Header;
