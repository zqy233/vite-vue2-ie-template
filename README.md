### 基于 vite+vue2

> vue3 不支持ie，vue2 版本使用 @vitejs/plugin-legacy 生产环境打包时做兼容性处理，可以兼容ie11，所以使用 vue2 技术栈最新版本搭建模板
>
> 常见问题：开发时ie白屏是正常的，@vitejs/plugin-legacy 是生产环境打包时做兼容性处理，可以打包后使用 vscode 的 Live Server 插件运行打包文件夹html，查看ie上是否正常显示
>
> 使用ie打开并预览 <https://zqy233.github.io/vite-vue2-ie-template/#/login> 👈，注意：需要右键>检查>勾选ie版本为11（默认ie版本为7）
>
> 模板只实现了登录页面，其他页面自行添加吧

### 依赖说明

对应 vue2 使用指定版本的依赖包，其余依赖包全部使用最新版本

- vue 使用 2+版本的最新
- vue-router 使用 3+版本的最新（3+对应 vue2，4+对应 vue3）
- vuex 使用 3+版本的最新（3+对应 vue2，4+对应 vue3）
- 使用element-ui，element-ui 对应 vue2，element-plus 对应 vue3
- vxe-table（一款使用开发可编辑表格的表格组件库）使用 3+版本的最新（3+对应 vue2，4+对应 vue3），该组件库依赖 xe-utils (该组件库的工具库)
- sass `1.32.13` element-ui 不支持高版本的 sass，会在控制台大量警告，固定使用`1.32.13`版本(https://github.com/ElemeFE/element/issues/21071)
- @vitejs/plugin-legacy 依赖 terser 和@babel/preset-env
- simple-git-hooks、prettier、lint-staged 用于 git commit 时自动格式化代码
- 以及一些常用的库，如果不需要可以自行删减

### vite 插件

- unplugin-auto-import 用于自动按需导入函数，比如说 composition api（vue2 中也可以用了）
- unplugin-vue-components 用于自动注册导入组件，components 文件夹下所有 vue 文件会被自动注册为组件
- 基于 unplugin-auto-import 和 unplugin-vue-components，element-ui组件也可以直接在页面中使用

### public

public/config.js 可以用于写入一些不希望被打包压缩的配置，比如设置请求地址等等

<details>
<summary><h3>问题解决：unplugin-vue-components 按需导入样式导致vite热更新卡顿</h3></summary><br>

`unplugin-vue-components`插件，开发环境按需导入样式会导致 vite 热更新卡顿

> https://github.com/antfu/unplugin-vue-components/issues/361

所以开发环境不按需导入样式，生产环境再按需导入样式

```js
      Components({
        resolvers: [
          ElementUiResolver({
            importStyle: mode === 'development' ? false : 'sass',
          }),
        ],
      }),
```

按需导入样式不支持函数式组件样式，需要在`vite.config.js`中手动导入函数式组件的样式，定义一个插件，生产环境添加函数式组件的样式

```js
{
        name: 'import-element-ui-style',
        enforce: 'pre',
        transform(code, id) {
          ...
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
```

<br></details>

<details>
<summary><h3>问题解决：element-ui 自定义主题色与unplugin-vue-components按需导入样式冲突解决</h3></summary><br>

> element-ui 自定义主题色 https://element.eleme.cn/2.0/#/zh-CN/component/custom-theme

#### 首先看下不使用`unplugin-vue-components`按需导入样式下怎么自定义主题色

创建`common.scss`文件，文件目录`src/assets/css/common.scss`，并在`main.js`中引入

`common.scss`文件内容

```scss
$--color-primary: #8956ff;
$--font-path: 'element-ui/lib/theme-chalk/fonts';
@import 'element-ui/packages/theme-chalk/src/index.scss';
```

`main.js`文件内容

```js
import Vue from 'vue';
import Element from 'element-ui';
import '@/assets/css/common.scss';

Vue.use(Element);
```

无需引入 Element 编译好的 CSS 文件`element-ui/lib/theme-chalk/index.css`

#### 再看下使用`unplugin-vue-components`按需导入样式下怎么自定义主题色

`common.scss`生产环境需要去除这两行，因为会与`unplugin-vue-components`按需导入样式冲突，重复导入样式了

```scss
$--font-path: 'element-ui/lib/theme-chalk/fonts';
@import 'element-ui/packages/theme-chalk/src/index.scss';
```

新建一个`element-variables.scss`全局 scss 变量文件，将 element-ui 的主题变量如`$--color-primary: #8956ff;`等移动到该文件中，因为`unplugin-vue-components`的原因，需要在`additionalData`全局 scss 变量文件中定义主题变量才能生效

注意！这个 scss 变量文件只应该存放一些 scss 变量，如果在这个文件里`$--font-path: 'element-ui/lib/theme-chalk/fonts';@import 'element-ui/packages/theme-chalk/src/index.scss';`会导致每次页面热更新时都会编译所有 element-ui 变量，热更新会卡顿至 3 秒左右

```js
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/assets/css/element-variables.scss";`,
          charset: false,
        },
      },
    },
```

定义一个 vite 插件，只有开发时才在`common.scss`中加入这两行代码

```js
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
          ...
        },
      },
```

<br></details>
