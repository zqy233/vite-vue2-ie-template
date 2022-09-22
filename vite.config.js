// import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import legacy from "@vitejs/plugin-legacy"
import vue2 from "@vitejs/plugin-vue2"
import { resolve } from "path"
import Components from "unplugin-vue-components/vite"
// 暂时存在问题，不使用官方的
// import { ElementUiResolver } from "unplugin-vue-components/resolvers"
import AutoImport from "unplugin-auto-import/vite"

function kebabCase(key) {
  const result = key.replace(/([A-Z])/g, " $1").trim()
  return result.split(" ").join("-").toLowerCase()
}

function getSideEffects(partialName, options) {
  const { importStyle = "css" } = options
  if (!importStyle) return
  if (importStyle === "sass") {
    return ["element-ui/packages/theme-chalk/src/base.scss", `element-ui/packages/theme-chalk/src/${partialName}.scss`]
  } else {
    return ["element-ui/lib/theme-chalk/base.css", `element-ui/lib/theme-chalk/${partialName}.css`]
  }
}
export default defineConfig({
  base: "./", // 根路径
  // 全局加载scss文件
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/assets/css/element-variables.scss";`,
        charset: false
      }
    }
  },
  build: {
    // 打包输出文件夹
    outDir: "docs"
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
            ["Message", "message"]
          ]
        }
      ], // 自动导入函数
      dts: false,
      resolvers: []
    }),
    //自动按需导入组件
    Components({
      dirs: ["src/components"], // 要导入组件的目录路径
      extensions: ["vue"],
      deep: true, // 搜索子目录
      dts: false, // 不使用ts
      include: [/\.vue$/, /\.vue\?vue/], // 只识别vue文件
      // 按需导入element-ui组件，目前官方的打包后的element-ui的resolver似乎有问题，打包后部分组件会空白
      resolvers: [
        ((options = { importStyle: "sass" }) => {
          return {
            type: "component",
            resolve: name => {
              if (options.exclude && name.match(options.exclude)) return
              if (/^El[A-Z]/.test(name)) {
                const compName = name.slice(2)
                const partialName = kebabCase(compName)
                if (partialName === "collapse-transition") {
                  return {
                    from: `element-ui/lib/transitions/${partialName}`
                  }
                }
                // 这里改写
                return {
                  name: compName,
                  from: `element-ui`,
                  sideEffects: getSideEffects(partialName, options)
                }
              }
            }
          }
        })()
      ]
    }),
    legacy({
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"]
    })
  ],
  resolve: {
    // 路径别名
    alias: {
      "@": resolve(__dirname, "src"),
      "~": resolve(__dirname, "node_modules"),
      "~@assets": resolve(__dirname, "src/assets"),
      "@utils": resolve(__dirname, "src/utils")
    }
  },
  server: {
    // 设置代理
    proxy: {
      // "/test": "http://192.168.4.203:8112",
    },
    port: 9007, // 端口号
    open: true // 是否自动打开浏览器
  }
})
