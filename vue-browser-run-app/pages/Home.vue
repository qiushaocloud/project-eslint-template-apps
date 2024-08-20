<template>
  <el-container class="home-container add-vh-100" direction="vertical">
    <Header />
    <el-main class="video-container add-important-flex-column">
      <div class="search-box">
        <el-input
          v-model="videoUrlInput"
          placeholder="请您输入视频地址"
          clearable
        >
          <template #prepend>视频地址：</template>
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
      <div class="video-box add-flex-column flex-1">
        <div class="video-url-box add-flex align-items-center">
          <el-icon><VideoCamera /></el-icon>当前播放地址:
          <el-link type="primary" :href="videoUrl" target="_blank" >{{ videoUrl }}</el-link>
        </div>
        <div class="video-inner add-position-relative flex-1">
          <video class="wh-percentage-100 bg-color-black add-position-absolute" :src="videoUrl" controls autoplay loop></video>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
  import { ref } from 'vue'
  import Header from '@views/Header/index.vue';
  import { Search } from '@element-plus/icons-vue';
  const videoUrlInput = ref('https://st.dj63.com//2022/车载视频/20240428/0344.周华健 - 难念的经.mp4');
  const videoUrl = ref(videoUrlInput.value);

  const handleSearch = () => {
    if (videoUrlInput.value && videoUrlInput.value === videoUrl.value) {
      videoUrl.value = '';
      // videoUrl.value = videoUrlInput.value;

      // return setTimeout(() => {
      // }, 300);
    }
    videoUrl.value = videoUrlInput.value;
  }
</script>

<style scoped lang="scss">
.home-container {
  height: 100vh;
  background-color: #f0f2f5;
}
</style>