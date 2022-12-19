### 基于 vite+vue2

> vue3 不支持 ie，所以基于 vue2 版本下的技术栈最新版本搭建模板，完美兼容 ie11

> 使用 ie 打开并预览 <https://zqy233.github.io/vite-vue2-ie-template/#/login> 👈

> 模板只实现了登录页面，其他页面自行添加吧

对应 vue2 使用指定版本的依赖包，其余依赖包全部使用最新版本

- vue `2.7.14` 使用 2+版本的最新
- vue-router `3.6.5` 使用 3+版本的最新（3+对应 vue2，4+对应 vue3）
- vuex `3.6.2` 使用 3+版本的最新（3+对应 vue2，4+对应 vue3）
- element-ui `2.15.12`（element-ui 对应 vue2，element-plus 对应 vue3）
- vxe-table `3.6.6` 一款使用开发可编辑表格的表格组件库，使用 3+版本的最新（3+对应 vue2，4+对应 vue3）
- sass `1.32.13` element-ui 不支持高版本的 sass，会在控制台大量警告，固定使用`1.32.13`版本(https://github.com/ElemeFE/element/issues/21071)

### vite 插件

- unplugin-auto-import 用于自动按需导入函数，比如说 composition api（vue2 中也可以用了）
- unplugin-vue-components 用于自动注册导入组件，components 文件夹下所有 vue 文件会被自动注册为组件
- 基于 unplugin-auto-import 和 unplugin-vue-components，element-ui 也可以直接使用了

### public

public/config.js 可以用于写入一些不希望被打包压缩的配置，比如设置请求地址等等
