<template>
  <el-main>
    <slot v-if="authUser.username"></slot>
    <el-card v-else class="rguest no-auth-card">
      <h1>您目前身份是游客，请您先登录！</h1>
    </el-card>
  </el-main>
</template>

<script>
import {mapState} from 'pinia';
import { useUserStore } from '@stores/user.mjs';

export default {
  computed: {
    ...mapState(useUserStore, ['authUser'])
  }
};
</script>