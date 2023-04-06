import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue2 from '@vitejs/plugin-vue2';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
// 打包后自动压缩生成zip，源码来自rollup-plugin-compression
import { compression } from './plugin/zip.js';
import { ElementUiResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';

export default ({ mode }) => {
  console.log(mode === 'development' ? '开发环境 ' + mode : '生产环境 ' + mode);
  return defineConfig({
    base: './', // 根路径
    // 全局scss变量文件
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
      outDir: 'docs',
      sourcemap: true,
    },
    plugins: [
      vue2(),
      // 自动导入函数
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'vuex',
          // 函数式组件需要手动引入
          {
            'element-ui': [
              ['Notification', 'notification'],
              ['Message', 'message'],
              ['MessageBox', 'messageBox'],
            ],
          },
        ],
        dts: false,
        resolvers: [],
      }),
      //自动按需导入组件
      Components({
        // unplugin-vue-components插件，开发环境按需导入会导致页面卡顿
        // https://github.com/antfu/unplugin-vue-components/issues/361
        // 生产环境再按需导入样式
        resolvers: [
          ElementUiResolver({
            importStyle: mode === 'development' ? false : 'sass',
          }),
        ],
      }),
      // 插件的作用请看项目readme
      {
        name: 'import-element-ui-style',
        enforce: 'pre',
        transform(code, id) {
          if (/common.scss$/.test(id)) {
            if (mode === 'development') {
              return {
                code: `${code}
                $--font-path: 'element-ui/lib/theme-chalk/fonts';
                @import 'element-ui/packages/theme-chalk/src/index.scss';`,
                map: null,
              };
            }
          }
          if (/src\/main.js$/.test(id)) {
            if (mode === 'production') {
              return {
                code: `${code}
                import 'element-ui/lib/theme-chalk/message.css';
                import 'element-ui/lib/theme-chalk/notification.css';
                import 'element-ui/lib/theme-chalk/message-box.css';`,
                map: null,
              };
            }
          }
        },
      },
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      mode === 'production' ? compression() : null,
    ],
    resolve: {
      // 路径别名
      alias: {
        '@': resolve(__dirname, 'src'),
        '~@assets': resolve(__dirname, 'src/assets'),
        '@utils': resolve(__dirname, 'src/utils'),
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
  });
};
