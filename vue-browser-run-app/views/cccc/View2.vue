<template>
  <div>{{ message }} uuuuu <img :src="xxx" alt=""> </div>
</template>

<script setup>
  import { ref } from 'vue'
  import xxx from '../../assets/images/touxiang.jpg';
  
  const message = ref('Hello World Page2 View2!')
</script>