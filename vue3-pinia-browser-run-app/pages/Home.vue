<template>
  <el-container class="home-container add-vh-100" direction="vertical">
    <Header />
    <auth-el-main class="video-container add-important-flex-column">
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
        <div class="counter-test-box add-flex flex-center">
          计数器测试 ==>
          <span style="margin: 0 10px;">count: {{ counterStore.count }}</span>
          <span style="margin-right: 10px;">doubleCount: {{ counterStore.doubleCount }}</span>
          <el-button @click="counterStore.increment">increment</el-button>
        </div>
      </div>
    </auth-el-main>
  </el-container>
</template>

<script setup>
  import { ref } from 'vue'
  import Header from '@views/Header/index.vue';
  import { VideoCamera, Search } from '@element-plus/icons-vue';
  import { useCounterStore } from '@stores/counter.mjs';

  const counterStore = useCounterStore();
  const videoUrlInput = ref('https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mp4');
  const videoUrl = ref(videoUrlInput.value);

  const handleSearch = () => {
    if (videoUrlInput.value && videoUrlInput.value === videoUrl.value) {
      videoUrl.value = '';
      return setTimeout(() => {
        videoUrl.value = videoUrlInput.value;
      }, 300);
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