import { Component, PropsWithChildren } from "react";
// import Taro from '@tarojs/taro'
// import { storage, setGlobalData, isWeapp } from './utils/config'
// import { getUserInfoByOpenId } from './utils'

// 引入 NutUI 全局样式
import "@nutui/nutui-react-taro/dist/style.css";
import { QueryProvider } from "./components/Common/queryClient";
import "./app.scss";

class App extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentWillMount() {
    // const company = Taro.getStorageSync(storage.company);
    // if (company) {
    //   setGlobalData("cid", company.id);
    // }
    // const user = Taro.getStorageSync(storage.user);
    // if (!user) {
    //   Taro.setStorageSync(storage.type, 1);
    //   isWeapp && getUserInfoByOpenId();
    // }
  }

  render() {
    return <QueryProvider>{this.props.children}</QueryProvider>;
  }
}

export default App;
