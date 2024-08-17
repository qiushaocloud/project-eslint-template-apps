<template>
  <div>
    <el-button plain @click="showMessage('ccccc')">Click to open the Message Box</el-button>
    {{ message }}
    11111
    <img :src="xxx" alt="">
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import xxx from '@assets/images/touxiang.jpg';
  import { showMessage } from '@js/element-plus-helper.mjs';

  const message = ref('Hello World Page1 Page!')
</script>