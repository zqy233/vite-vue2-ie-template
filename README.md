# [EN](https://github.com/zqy233/vite-vue2-ie-template/blob/main/README-EN.md) | 中文

# Vite + Vue 2 IE 兼容模板

> ⚠️ Vue 3 **不支持 IE**。本模板使用 Vue 2 搭配 `@vitejs/plugin-legacy` 插件，在 **生产构建阶段** 兼容 IE11 和 IE10。
>
> 🧪 在线演示地址（支持 IE）：[https://zqy233.github.io/vite-vue2-ie-template/#/login](https://zqy233.github.io/vite-vue2-ie-template/#/login)
> ⚠️ 注意：IE 默认以兼容模式（IE7）打开页面，需手动切换为 IE11 或 IE10。

### ✅ 环境（建议使用最新版本）

- Node.js：**v24.4.1**
- pnpm：**v10.13.1**

### ⚠️ 重要说明

#### 1. Vite 不再支持已结束维护的 Node.js 18

Vite 要求使用 **Node.js 20.19+** 或 **22.12+**。
已验证 Node.js **v24.5.1** 可正常用于开发和构建。

#### 2. 开发模式下 IE 白屏是正常现象

`@vitejs/plugin-legacy` 插件仅在 **生产构建** 中生效，开发模式（`vite dev`）中不支持。
如需在 IE 中测试，请先执行构建，再在 IE 中打开构建产物。

#### 3. IE 默认以兼容模式（IE7）打开页面，需手动切换为 IE11 或 IE10

建议使用 Microsoft Edge 的 IE 模式进行测试：

**测试步骤：**

1. 执行构建，并使用 **Live Server**（VSCode 插件）打开构建输出目录中html。
2. 在 **Microsoft Edge** 中打开页面，并通过菜单切换到 IE 模式。
3. 使用 `IEChooser.exe` 工具选择浏览器标签页并切换 IE 版本：

   `Win + R → 输入 %systemroot%\system32\f12\IEChooser.exe`，
   然后在右上角切换为 IE11/IE10。

✅ 已验证：IE11 和 IE10 可正常展示。
❌ 不支持更低版本（如 IE9 或 IE8）。

---

## 依赖概览

本项目使用与 Vue 2 兼容的最新依赖版本。

| 依赖包名称                                    | 版本    | 说明                                    |
| --------------------------------------------- | ------- | --------------------------------------- |
| `vue`                                         | 2.7.16  | Vue 2 最终版本                          |
| `vue-router`                                  | 3.6.5   | Vue 2 对应的最终版本                    |
| `vuex`                                        | 3.6.2   | Vue 2 对应的最终版本                    |
| `element-ui`                                  | 2.15.14 | Vue 2 专用，Vue 3 请使用 `element-plus` |
| `vxe-table`                                   | 3.x     | Vue 2 版本，强大的行内编辑表格          |
| `sass`                                        | 最新    | 已配置vite关闭旧版本 Sass 语法的警告    |
| `@vitejs/plugin-legacy`                       | —       | 为旧浏览器添加 polyfill 和语法降级      |
| `simple-git-hooks`, `prettier`, `lint-staged` | —       | 实现提交时自动格式化代码                |

---

## Vite 插件说明

- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import)：自动引入函数（支持 Vue 2.7 的组合式 API）。
- [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components)：自动注册 `components` 目录下的 Vue 组件。
- 可通过配置自动引入 **Element UI** 的组件及样式。

---

## 公共配置说明

全局配置（如 API 地址等）建议写在 `public/config.js` 中，避免被打包压缩。

---

## 🧩 已知问题与解决方案

<details>
<summary><strong>⚡ unplugin-vue-components 按需导入样式导致vite热更新卡顿</strong></summary>

`unplugin-vue-components`插件，开发环境按需导入样式会导致 vite 热更新卡顿

> https://github.com/antfu/unplugin-vue-components/issues/361

**解决方案：**
开发模式下关闭样式自动引入，仅在生产环境启用：

```js
Components({
  resolvers: [
    ElementUiResolver({
      importStyle: mode === 'development' ? false : 'sass',
    }),
  ],
}),
```

对于 Element UI 的函数式组件（如 `$message`、`$notify` 等），样式不会自动引入，需在生产环境手动添加：

```js
{
  name: 'import-element-ui-style',
  enforce: 'pre',
  transform(code, id) {
    if (/src\/main.js$/.test(id) && mode === 'production') {
      return {
        code: `${code}
import 'element-ui/lib/theme-chalk/message.css';
import 'element-ui/lib/theme-chalk/notification.css';
import 'element-ui/lib/theme-chalk/message-box.css';`,
        map: null,
      }
    }
  },
},
```

</details>

<details>
<summary><strong>🎨 element-ui 自定义主题色与unplugin-vue-components按需导入样式冲突解决</strong></summary>

element-ui 自定义主题色 https://element.eleme.cn/2.0/#/zh-CN/component/custom-theme

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
