<template>
  <div class="container">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 去除谷歌浏览器input输入框选中情况下的背景色 */
input:-webkit-autofill {
  transition: background-color 500000s ease-in-out 0s;
}
</style>
