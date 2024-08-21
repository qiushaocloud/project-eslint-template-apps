<template>
  <div class="register-container">
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
    <el-card v-if="!isAuthed" class="register-card">
      <h2 class="register-title">注册</h2>
      <AddOrEditUserForm actionType="Register" @onAddUserSuccess="handleAddUserSuccess">
        <span style="margin-left: 30px;">已有账号？</span>
        <el-link type="primary" @click="goToLogin">点击登录</el-link>
      </AddOrEditUserForm>
    </el-card>
  </div>
</template>

<script>
import RouteService from '@services/RouteService.mjs';
import { mapState } from 'pinia';
import { useUserStore } from '@stores/user.mjs';
import AddOrEditUserForm from '@views/Header/AddOrEditUserForm.vue';
import { showMessageBox } from '@helpers/element-plus-helper.mjs';
import Settings from '@views/Header/Settings.vue';

export default {
  name: 'Register',
  components: {
    AddOrEditUserForm,
    Settings
  },
  computed: {
    ...mapState(useUserStore, ['authUser']),
    isAuthed() {
      return !!this.authUser.username;
    }
  },
  methods: {
    // 跳转到注册页面
    goToLogin() {
      RouteService.navigateToLoginOrRegister('/login');
    },
    navigateToRedirect() {
      RouteService.navigateToRedirect();
    },
    handleAddUserSuccess() {
      showMessageBox('注册成功，是否跳转到登录界面？')
        .then(() => {
          this.goToLogin();
        });
    }
  }
};
</script>

<style scoped lang="scss">
.register-container {
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
  
  .register-card {
    padding-right: 10px;

    .register-title {
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
