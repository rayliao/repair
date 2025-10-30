import { defineConfig, type UserConfigExport } from "@tarojs/cli";
import devConfig from "./dev";
import prodConfig from "./prod";
const isH5 = process.env.CLIENT_ENV === "h5";
const HOST = '"https://api.zxjl.com"';

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<"vite">(async (merge) => {
  const baseConfig: UserConfigExport<"vite"> = {
    projectName: "repair",
    date: "2025-9-18",
    designWidth: 375,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    // 开启 HTML 插件
    plugins: ["@tarojs/plugin-html"],
    defineConstants: {
      HOST: isH5 ? '"/api"' : HOST,
    },
    copy: {
      patterns: [],
      options: {},
    },
    framework: "react",
    compiler: "vite",
    // NutUI 相关配置
    vite: {
      optimizeDeps: {
        exclude: ["@nutui/nutui-react-taro", "@nutui/icons-react-taro"],
      },
      css: {
        preprocessorOptions: {
          scss: {
            // 全局导入 NutUI 变量文件，所有 scss 文件都能使用
            additionalData:
              '@import "@nutui/nutui-react-taro/dist/styles/variables.scss";',
          },
        },
      },
    },
    cache: {
      enable: false, // 根据官方建议关闭 cache
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
      debugReact: true,
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css",
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };
  if (process.env.NODE_ENV === "development") {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
