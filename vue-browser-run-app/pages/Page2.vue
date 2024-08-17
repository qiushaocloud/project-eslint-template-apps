<template>
  <div>{{ message }}  kkkk <View2 /> </div>
</template>

<script setup>
  import { ref } from 'vue'
  import View2 from '@views/cccc/View2.vue';

  const message = ref('Hello World Page2 Page!')
</script>