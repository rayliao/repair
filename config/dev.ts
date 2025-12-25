import type { UserConfigExport } from "@tarojs/cli";

const isH5 = process.env.CLIENT_ENV === "h5";
const HOST = '"https://api.zxjl.com"';

export default {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {
    HOST: isH5 ? '"/api"' : HOST,
  },
  weapp: {},
  h5: {
    devServer: {
      proxy: {
        "/api/": {
          target: JSON.parse(HOST),
          changeOrigin: true,
        },
      },
    },
  },
} satisfies UserConfigExport<"vite">;
