<template>
	<el-header class="header-box">
		<div class="logo-box">
      <el-avatar :icon="AvatarIcon" src="@assets/images/touxiang.jpg" alt="logo" />
      <span class="user-name" v-if="authUser.username" >{{ authUser.nickname || authUser.username }}, 欢迎您！</span>
    </div>
    <ul class="nav-menus">
      <li class="menu"><router-link to="/">首页</router-link></li>
      <li class="menu"><router-link to="/user-manage-table">用户管理-表格</router-link></li>
      <li class="menu"><router-link to="/user-manage-list">用户管理-列表</router-link></li>
      <li class="menu"><router-link to="/test-echarts">ECharts 测试</router-link></li>
    </ul>
    <div class="authed-user-box" v-if="authUser.username">
      <el-button @click="showAddUserBox"><el-icon style="padding-right: 5px;"><UserIcon /></el-icon>添加用户</el-button>
      <el-button @click="showEditMyUserBox"><el-icon style="padding-right: 5px;"><EditIcon /></el-icon>修改我的信息</el-button>
      <el-button type="primary" link @click="userLogout" >退出登录</el-button>
    </div>
    <div class="no-auth-user-box" v-if="!authUser.username">
      <router-link to="/login">登录</router-link>
      <router-link to="/register">注册</router-link>
    </div>
    <Settings />
	</el-header>
</template>

<script setup>
  import { h, computed } from 'vue';
  import { useUserStore } from '@stores/user.mjs';
  import { showConfirmBox, showMessageBox } from '@helpers/element-plus-helper.mjs';
  import UserService from '@services/UserService.mjs';
  import RouteService from '@services/RouteService.mjs';
  import AddOrEditUserForm from './AddOrEditUserForm.vue';
  import Settings from './Settings.vue';
  import { Avatar as AvatarIcon, Edit as EditIcon, User as UserIcon } from '@element-plus/icons-vue';

  const userStore = useUserStore();
  const authUser = computed(() => userStore.authUser);
  
  const userLogout = () => {
    showConfirmBox('确认退出登录吗？').then(() => {
      UserService.userLogout();
      RouteService.navigateToLoginOrRegister('/login');
    });
  }

  const showAddUserBox = () => {
    showMessageBox(() => h(AddOrEditUserForm, {autoCloseMessageBox: true}), {
      class: 'add-user-box',
      title: '用户添加框',
      showConfirmButton: false,
      customStyle: {
        width: '100%'
      }
    });
  }

  const showEditMyUserBox = () => {
    showMessageBox(() => h(AddOrEditUserForm, {autoCloseMessageBox: true, actionType: 'Update', updateUserId: authUser.value.id}), {
      class: 'edit-my-user-box',
      title: '编辑我的信息',
      showConfirmButton: false,
      customStyle: {
        width: '100%'
      }
    });
  }
</script>

<style scoped lang="scss">
  @import '@scss/mixins.scss';

  .header-box {
    @include flex-config($is-center: true);
    padding: 6px 8px;
    background-color: #333;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 14px;
  }

  .logo-box {
    @include flex-config($is-center: true);
    margin-right: 20px;

    .user-name {
      margin-left: 10px;
    }
  }

  .nav-menus {
    @include flex-config($is-center: true);
    flex: 1;
    list-style: none;
    padding: 0;
    margin: 0;

    .menu {
      margin: 0 10px;

      a {
        color: white;
        text-decoration: none;
        padding: 5px 10px;
        border-radius: 5px;
        transition: background-color 0.3s, color 0.3s;

        &:hover {
          background-color: #555;
        }

        &.router-link-exact-active {
          background-color: #42b983;
          color: white;
        }
      }
    }
  }

  .authed-user-box, .no-auth-user-box {
    @include flex-config($is-center: true);

    .user-name {
      margin-right: 10px;
    }

    a {
      color: white;
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 5px;
      transition: background-color 0.3s, color 0.3s;

      &:hover {
        background-color: #555;
      }
    }
  }

  .no-auth-user-box {
    a {
      margin-left: 10px;
    }
  }
</style>
