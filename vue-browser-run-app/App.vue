<!-- App.vue -->
<template>
  <div class="app-container">
    <div id="nav">
      <span class="left">
        <img src="./assets/images/touxiang.jpg" width="50px" height="50px" alt="logo">
        <router-link to="/"> 首页 </router-link>
      </span>
      <span class="right">
        <router-link v-if="!authUser.name" to="/login"> 登录 </router-link>
        <router-link to="/register"> 注册 </router-link>
      </span>
    </div>
    <router-view />
  </div>
</template>

<script>
  import './scss/global.scss';
  import { showMessage } from '@js/element-plus-helper.mjs';
  import { mapState, mapActions } from 'vuex';

  export default {
    computed: {
      ...mapState(['authUserInfo', 'disabledUserAuthCheck']),
    },
    methods: {
      ...mapActions(['setAuthUserInfo']),
    },
    created() {
      console.log('App created'); 

      const listenChanged = (toRoutePath) => {
        !toRoutePath && (toRoutePath = this.$router.currentRoute.value.path);
        const authUserInfo = window.getAuthUserInfo();
        this.setAuthUserInfo(authUserInfo);

        if (/^\/(login|register)$/.test(toRoutePath)) { // 登录和注册页面不需要监听
          window.stopIntervalCheckUserAuth(true);
          return;
        }

        // 监听用户登录状态变化
        window.startIntervalCheckUserAuth((isAuthValid) => {
          const authUserInfo = window.getAuthUserInfo();
          this.setAuthUserInfo(authUserInfo);
          if (isAuthValid) return;
          showMessage('您的登录已过期，请您重新登录！', {title: '登录提示', showClose: false, isCloseHistory: true}, () => {
            const {path, query} = this.$router.currentRoute.value;
            console.log('redirect to login page');
            this.$router.push({ path: '/login', query: { ...query, redirect_info: btoa(JSON.stringify({path, query})) } });
          });
        }, {firstForceUpdate: true});
      }
      listenChanged();

      // 监听路由变化
      this.$router.afterEach((to, from) => {
        console.log('route path changed, clean cache old user auth', from.path, to.path);
        listenChanged(to.path);
      });
    }
  }
</script>