<template>
  <div class="login-container">
    <Settings />
    <el-dialog
      class="authed-dialog"
      v-if="isAuthed"
      v-model="isAuthed"
      title="已登陆提醒"
      width="500"
      :show-close="false"
      type="info"
      fullscreen
    >
      <div class="dialog-content"><span class="nickname add-font-bold">{{ authUser.nickname }}</span>，您已登录，点击确定直接跳转到业务界面！</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="ok-btn" type="primary" @click="navigateToRedirect">确定跳转</el-button>
        </div>
      </template>
    </el-dialog>
    <el-card v-if="!isAuthed" class="login-card">
      <h2 class="login-title">登录</h2>
      <el-form :model="form" :rules="rules" ref="loginForm" label-width="80px" @keydown.enter="handleEnterSubmit">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" show-password type="password" />
        </el-form-item>

        <el-form-item>
          <!-- 登录按钮 -->
          <el-button class="flex-1" type="primary" @click="onLogin">登录</el-button>
          <!-- 跳转到注册页面 -->
          <span style="margin-left: 30px;">还没有账号？</span>
          <el-link type="primary" @click="goToRegister">点击注册</el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { showMsgTip } from '@js/element-plus-helper.mjs';
import RouteService from '@services/RouteService.mjs';
import UserService from '@services/UserService.mjs';
import { mapState } from 'vuex';
import Settings from '@views/Header/Settings.vue';

export default {
  name: 'Login',
  components: {
    Settings,
  },
  data() {
    return {
      // 表单数据
      form: {
        username: '',
        password: '',
      },
      // 验证规则
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  computed: {
    ...mapState('user', ['authUser']),
    isAuthed() {
      return !!this.authUser.username;
    }
  },
  methods: {
    // 登录逻辑
    onLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const isLoginSuccess = UserService.userLogin(this.form.username, this.form.password);
          if (!isLoginSuccess) {
            console.log('登录失败', this.form);
            return showMsgTip('登陆失败，请您输入正确的用户名和密码！', {type: 'error'});
          }
          console.log('登录成功', this.form);
          showMsgTip('登陆成功！', {type:'success'});
          return RouteService.navigateToRedirect();
        }
        
        console.log('验证失败');
        return false;
      });
    },
    handleEnterSubmit(event) {
      event.stopPropagation();
      event.preventDefault();
      if (this.form.username && this.form.password)
        this.onLogin();
    },
    // 跳转到注册页面
    goToRegister() {
      RouteService.navigateToLoginOrRegister('/register');
    },
    navigateToRedirect() {
      RouteService.navigateToRedirect();
    }
  },
  mounted() {
    // 自动焦点到可输入的输入框，即：不是 disabled 和 onlyread 的输入框
    const firstInputField = this.$el && this.$el.querySelector('input:not([disabled]):not([readonly])');
    firstInputField && firstInputField.focus();
  }
};
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;

  /deep/ .settings-box {
    .open-settings-btn {
      color: #3d3b3b;
      font-size: 22px;
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  .login-card {
    width: 400px;
    padding-right: 10px;

    .login-title {
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
      color: #333;
    }
  }

  /deep/ .authed-dialog {
    .el-dialog__header .el-dialog__title {
      font-weight: bolder;
      font-size: 30px;
    }

    .dialog-content {
      padding: 10px 25px;
      font-size: 20px;
    }

    .ok-btn {
      font-size: 20px;
      padding: 20px 15px;
    }
  }
}
</style>
