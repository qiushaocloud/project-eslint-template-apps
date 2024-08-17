<template>
	<nav class="header-box add-flex">
		<div class="logo-box">
      <img src="@assets/images/touxiang.jpg" width="50px" alt="logo" />
    </div>
    <nav class="nav-box">
      <ul class="menus">
        <li class="menu"><router-link to="/">首页</router-link></li>
        <li class="menu"><router-link to="/user-manage-table">用户管理-表格</router-link></li>
        <li class="menu"><router-link to="/user-manage-list">用户管理-列表</router-link></li>
      </ul>
    </nav>


	</nav>
</template>

<script setup>
  import { ref } from 'vue'
  const message = ref('Hello World Register Page!')
</script>

<style scoped lang="scss">

</style>