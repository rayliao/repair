// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
      compiler: 'vite',
    }]
  ],
  plugins: [
    [
      'import',
      {
        libraryName: '@nutui/nutui-react-taro',
        camel2DashComponentName: false,
        customName: (name, file) => {
          return `@nutui/nutui-react-taro/dist/esm/packages/${name.toLowerCase()}`
        },
        // 自动加载 scss 样式文件
        customStyleName: (name) =>
          `@nutui/nutui-react-taro/dist/esm/packages/${name.toLowerCase()}/style`,
      },
      'nutui-react',
    ],
  ],
}
