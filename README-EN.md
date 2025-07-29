# Vite + Vue 2 IE-Compatible Template

> ⚠️ Vue 3 **does not support IE**. This template uses Vue 2 with the `@vitejs/plugin-legacy` plugin to provide compatibility for IE11 and IE10 **during production builds only**.
>
> 🧪 Live demo (IE supported): [https://zqy233.github.io/vite-vue2-ie-template/#/login](https://zqy233.github.io/vite-vue2-ie-template/#/login)
> ⚠️ Note: IE opens pages in compatibility mode (IE7) by default. You must manually switch to IE11 or IE10.

### ✅ Environment (latest versions recommended)

- Node.js: **v24.4.1**
- pnpm: **v10.13.1**

### ⚠️ Important Notes

#### 1. Vite no longer supports Node.js 18, which has reached end-of-life

Vite requires **Node.js 20.19+** or **22.12+**.
Node.js **v24.5.1** has been tested and confirmed to work for both development and build.

#### 2. White screen in IE during development is expected

The `@vitejs/plugin-legacy` plugin is only effective **in production builds**, and does **not** support development mode (`vite dev`).
To test in IE, please build the project first, then open the output in IE.

#### 3. IE opens in compatibility mode (IE7) by default; you must manually switch to IE11 or IE10

It’s recommended to test using Microsoft Edge's IE mode:

**Testing Steps:**

1. Build the project and open the generated HTML with **Live Server** (VSCode extension).
2. Open the page in **Microsoft Edge**, and switch to IE mode via the menu.
3. Use the `IEChooser.exe` tool to select a browser tab and switch IE version:

   `Win + R → type %systemroot%\system32\f12\IEChooser.exe`,
   then switch to IE11/IE10 from the top-right menu.

✅ Verified: IE11 and IE10 display correctly.
❌ Lower versions (e.g., IE9 or IE8) are not supported.

---

## Dependency Overview

This project uses the latest versions compatible with Vue 2.

| Dependency Name                               | Version | Notes                                                    |
| --------------------------------------------- | ------- | -------------------------------------------------------- |
| `vue`                                         | 2.7.16  | Final Vue 2 release                                      |
| `vue-router`                                  | 3.6.5   | Final version compatible with Vue 2                      |
| `vuex`                                        | 3.6.2   | Final version compatible with Vue 2                      |
| `element-ui`                                  | 2.15.14 | For Vue 2 only. Use `element-plus` for Vue 3             |
| `vxe-table`                                   | 3.x     | Vue 2 version with powerful inline editing               |
| `sass`                                        | latest  | Configured in vite to silence old syntax warnings        |
| `@vitejs/plugin-legacy`                       | —       | Adds polyfills and syntax transforms for legacy browsers |
| `simple-git-hooks`, `prettier`, `lint-staged` | —       | Enables auto-formatting on commit                        |

---

## Vite Plugin Overview

- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import): Auto-imports functions (supports Vue 2.7 Composition API).
- [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components): Auto-registers components from the `components` directory.
- Can be configured to auto-import **Element UI** components and styles.

---

## Public Config Instructions

Global configuration (e.g., API URLs) is recommended to be placed in `public/config.js` to avoid being bundled and minified.

---

## 🧩 Known Issues & Solutions

<details>
<summary><strong>⚡ Vite HMR slows down when using style auto-import from unplugin-vue-components</strong></summary>

When using the `unplugin-vue-components` plugin, enabling style auto-import in development mode can slow down Vite HMR significantly.

> [https://github.com/antfu/unplugin-vue-components/issues/361](https://github.com/antfu/unplugin-vue-components/issues/361)

**Solution:**
Disable style auto-import in development mode, enable only in production:

```js
Components({
  resolvers: [
    ElementUiResolver({
      importStyle: mode === 'development' ? false : 'sass',
    }),
  ],
}),
```

For Element UI functional components (like `$message`, `$notify`, etc.), styles are not auto-imported and need to be manually added in production:

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
<summary><strong>🎨 Resolving conflicts between Element UI custom theme and unplugin-vue-components style import</strong></summary>

Element UI custom theme documentation: [https://element.eleme.cn/2.0/#/zh-CN/component/custom-theme](https://element.eleme.cn/2.0/#/zh-CN/component/custom-theme)

#### First, without using `unplugin-vue-components` style import

Create a `common.scss` file under `src/assets/css/common.scss`, and import it in `main.js`.

`common.scss` content:

```scss
$--color-primary: #8956ff;
$--font-path: 'element-ui/lib/theme-chalk/fonts';
@import 'element-ui/packages/theme-chalk/src/index.scss';
```

`main.js` content:

```js
import Vue from 'vue';
import Element from 'element-ui';
import '@/assets/css/common.scss';

Vue.use(Element);
```

No need to import precompiled Element UI CSS (`element-ui/lib/theme-chalk/index.css`).

#### Then, when using `unplugin-vue-components` with style auto-import

In production, remove these two lines from `common.scss` to avoid conflicts and duplicate imports:

```scss
$--font-path: 'element-ui/lib/theme-chalk/fonts';
@import 'element-ui/packages/theme-chalk/src/index.scss';
```

Create a new `element-variables.scss` file for global SCSS variables. Move variables like `$--color-primary: #8956ff;` to this file.
Due to `unplugin-vue-components`, these theme variables must be defined in `additionalData` for them to take effect.

**Important:** This SCSS file should only contain variables.
If you add `$--font-path: ...` or `@import '.../index.scss';`, it will trigger full Element UI recompilation during each hot update and cause \~3s HMR lag.

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

Define a Vite plugin to inject those two lines into `common.scss` **only in development** mode:

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

</details>
