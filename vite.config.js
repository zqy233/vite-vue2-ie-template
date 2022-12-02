import { defineConfig } from "vite"
import legacy from "@vitejs/plugin-legacy"
import vue2 from "@vitejs/plugin-vue2"
import { resolve } from "path"
import Components from "unplugin-vue-components/vite"
// 打包后自动压缩生成zip，源码来自rollup-plugin-compression
import { compression } from "./plugin/zip.js"
import { ElementUiResolver } from "unplugin-vue-components/resolvers"
import AutoImport from "unplugin-auto-import/vite"

export default defineConfig({
  base: "./", // 根路径
  // 全局加载scss文件
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/assets/css/element-variables.scss";`,
        charset: false,
      },
    },
  },
  build: {
    // 打包输出文件夹
    outDir: "docs",
  },
  plugins: [
    vue2(),
    // 自动导入函数
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vuex",
        {
          "element-ui": [
            ["Notification", "notification"],
            ["Message", "message"],
          ],
        },
      ],
      dts: false,
      resolvers: [],
    }),
    //自动按需导入组件
    Components({
      // 按需导入element-ui组件
      resolvers: [ElementUiResolver({ importStyle: "sass" })],
    }),
    legacy({
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
    compression(),
  ],
  resolve: {
    // 路径别名
    alias: {
      "@": resolve(__dirname, "src"),
      "~@assets": resolve(__dirname, "src/assets"),
      "@utils": resolve(__dirname, "src/utils"),
    },
  },
  server: {
    // 设置代理
    proxy: {
      // "/test": "http://192.168.4.203:8112",
    },
    port: 9007, // 端口号
    open: true, // 是否自动打开浏览器
  },
})
