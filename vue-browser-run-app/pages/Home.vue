<template>
  <div>

    <div>{{ message }}</div>
    <img :src="xxx" alt="touxiang" />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import xxx from '../assets/images/touxiang.jpg';
  const message = ref('Hello World Home Page!')
</script>