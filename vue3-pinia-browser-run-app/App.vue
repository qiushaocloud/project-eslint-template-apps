<!-- App.vue -->
<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script>
  import './scss/global.scss';
  import { getCurrentInstance } from 'vue';
  import { showMessageBox } from '@helpers/element-plus-helper.mjs';
  import { mapState } from 'pinia';
  import { useUserStore } from '@stores/user.mjs';
  import UserService from '@services/UserService.mjs';
  import RouteService from '@services/RouteService.mjs';
  import AuthElMain from '@views/Auth/AuthElMain.vue';

  export default {
    setup() {
      // 在这里安装全局 组件
      const app = getCurrentInstance().appContext.app;
      app.component('AuthElMain', AuthElMain);
    },
    computed: {
      ...mapState(useUserStore, ['authUser']),
    },
    created() {
      console.log('App created');

      let listenTimer;
      // 监测用户是否过期
      const listenChanged = () => {
        if (/^\/(login|register)$/.test(RouteService.getCurrentRoutePath())) { // 登录和注册页面不需要监听
          listenTimer && clearTimeout(listenTimer);
          listenTimer = undefined;
          return;
        }
        
        const intervalHandler = () => {
          if (UserService.checkAuthValid()) return; // 用户登录状态有效
          listenTimer && clearTimeout(listenTimer);
          listenTimer = undefined;
          const hasAuthUser = !!this.authUser.username;
          UserService.deleteInvalidAuthUser();
          console.log(`${!hasAuthUser ? 'user not login' : 'user auth expired' }, need redirect to login page`);
          showMessageBox(!hasAuthUser ? '您还没有登录，请您登录！' : '您的登录已过期，请您重新登录！', {title: '登录提示', showClose: false, isCloseHistory: true})
            .then(() => {
              console.log('redirect to login page');
              RouteService.navigateToLoginOrRegister('/login')
            });
        }

        listenTimer && clearTimeout(listenTimer);
        listenTimer = setInterval(intervalHandler, 2000);
        intervalHandler();
      }
      listenChanged();

      // 监听路由变化
      let routeChangeTimer;
      this.$router.afterEach((to, from) => {
        console.log('route path changed, clean cache old user auth, from.path:', from.path, ' ,to.path:', to.path);
        routeChangeTimer && clearTimeout(routeChangeTimer);
        routeChangeTimer = setTimeout(() => {
          routeChangeTimer = undefined;
          listenChanged();
        }, 300);
      });
    }
  }
</script>