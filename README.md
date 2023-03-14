### 基于 vite+vue2

> vue3 不支持 ie，所以基于 vue2 版本下的技术栈最新版本搭建模板，完美兼容 ie11
>
> 使用 ie 打开并预览 <https://zqy233.github.io/vite-vue2-ie-template/#/login> 👈
>
> 模板只实现了登录页面，其他页面自行添加吧

### 依赖说明

对应 vue2 使用指定版本的依赖包，其余依赖包全部使用最新版本

- vue `2.7.14` 使用 2+版本的最新
- vue-router `3.6.5` 使用 3+版本的最新（3+对应 vue2，4+对应 vue3）
- vuex `3.6.2` 使用 3+版本的最新（3+对应 vue2，4+对应 vue3）
- element-ui `2.15.13` element-ui 对应 vue2，element-plus 对应 vue3
- vxe-table `3.6.10` 一款使用开发可编辑表格的表格组件库，使用 3+版本的最新（3+对应 vue2，4+对应 vue3）
- sass `1.32.13` element-ui 不支持高版本的 sass，会在控制台大量警告，固定使用`1.32.13`版本(https://github.com/ElemeFE/element/issues/21071)
- @vitejs/plugin-legacy 依赖 terser 和@babel/preset-env
- simple-git-hooks、prettier、lint-staged 用于 git commit 时自动格式化代码
- 以及一些常用的库，如果不需要可以自行删减

### vite 插件

- unplugin-auto-import 用于自动按需导入函数，比如说 composition api（vue2 中也可以用了）
- unplugin-vue-components 用于自动注册导入组件，components 文件夹下所有 vue 文件会被自动注册为组件
- 基于 unplugin-auto-import 和 unplugin-vue-components，element-ui 也可以直接使用了

### public

public/config.js 可以用于写入一些不希望被打包压缩的配置，比如设置请求地址等等

<details>
<summary><h3>element-ui 自定义主题色与`unplugin-vue-components`按需导入样式冲突解决</h3></summary><br>

> element-ui 自定义主题色 https://element.eleme.cn/2.0/#/zh-CN/component/custom-theme

#### 首先先来看下不使用`unplugin-vue-components`按需导入样式下怎么自定义主题色

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

#### 使用`unplugin-vue-components`按需导入样式下怎么自定义主题色

1.`unplugin-vue-components`插件，开发环境按需导入样式会导致页面卡顿

> https://github.com/antfu/unplugin-vue-components/issues/361

所以开发环境不按需导入样式，生产环境再按需导入样式

```js
//自动按需导入组件
      Components({
        resolvers: [
          ElementUiResolver({
            importStyle: mode === 'development' ? false : 'sass',
          }),
        ],
      }),
```

2.`common.scss`生产环境需要去除这两行，因为会与`unplugin-vue-components`按需导入样式冲突，重复导入样式了

```js
$--font-path: 'element-ui/lib/theme-chalk/fonts';
@import 'element-ui/packages/theme-chalk/src/index.scss';
```

3.新建一个`element-variables.scss`全局 scss 变量文件，将 element-ui 的主题变量如`$--color-primary: #8956ff;`等移动到该文件中，因为`unplugin-vue-components`按需导入样式需要在该文件中定义主题变量才能生效

注意！这个 scss 变量文件只应该存放一些 scss 变量，如果在这个文件里`@import 'element-ui/packages/theme-chalk/src/index.scss';`会导致每次页面热更新时都会编译所有 element-ui 变量，热更新会卡顿至 3 秒左右

```js
  // 全局scss变量文件
    css: {
      preprocessorOptions: {
        scss: {
          // 全部导入需要在main.js中导入的全局样式中使用变量，按需导入需要在全局sass变量使用element-ui变量
          additionalData: `@import "src/assets/css/element-variables.scss";`,
          charset: false,
        },
      },
    },
```

综上，定义一个 vite 插件，只有开发时才在`common.scss`中加入上方两行代码，并且生产环境需要在`src/main.js`中手动导入函数式组件的样式

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
