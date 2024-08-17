<template>
  <div>
    <el-button plain @click="loginOk">登录完成</el-button>
    <div>{{ message }}</div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const message = ref('Hello World Login Page11!');
  const router = useRouter()

  const loginOk = () => {
    console.log('login ok');
    message.value = '登录成功！'

    const {redirect_info} = router.currentRoute.value.query;
    if (!redirect_info) return console.log('no redirect_info');
    try {
      const redirectJson = JSON.parse(atob(redirect_info));
      if (redirectJson && redirectJson.path && redirectJson.query) {
        console.log('login success, redirect to', redirectJson.path, redirectJson.query);
        window.cleanCacheIntervalOldUserAuth();
        router.push({path: redirectJson.path, query: redirectJson.query});
      }
    } catch (err) {
      console.error('redirect_info parse error', err, redirect_info);
    }
  }
</script>