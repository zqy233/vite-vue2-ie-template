<template>
  <div class="login-page">
    <div class="login">
      <el-form
        ref="loginForm"
        :model="loginForm"
        class="login-form"
        autocomplete="on"
        label-position="left">
        <p class="form-title">登录</p>
        <el-form-item
          prop="username"
          required
          :show-message="false">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            type="text"
            autocomplete="on"
            @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item
          prop="password"
          required
          :show-message="false">
          <el-input
            ref="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            autocomplete="on"
            @keyup.enter="handleLogin"></el-input>
        </el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="handleLogin">
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    /** 校验登录 */
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) this.login();
        return false;
      });
    },
    login() {
      // 这里使用unplugin-auto-import导入的，在vite.config.js中AutoImport中配置的
      message.success('没有后续页面啦');
      notification.success('后续需要你自己写啦');
    },
  },
};
</script>

<style scoped lang="scss">
.login-page {
  width: 100%;
  height: 100vh;
  background-color: #f1f3f4;

  .login {
    position: fixed;
    width: 420px;
    height: 480px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    padding: 70px 50px;
    border-radius: 8px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    .form-title {
      text-align: center;
      margin-bottom: 50px;
      font-size: 24px;
      font-weight: bold;
      color: #333333;
    }

    .el-input {
      height: 50px;
      margin-bottom: 20px;
    }

    .login-btn {
      width: 100%;
      height: 50px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
