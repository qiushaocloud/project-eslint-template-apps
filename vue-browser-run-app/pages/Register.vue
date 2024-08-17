<template>
  <div>
    <div>{{ message }}</div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const message = ref('Hello World Register Page!')
</script>