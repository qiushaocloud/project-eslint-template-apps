<template>
  <div class="settings-box">
    <el-button class="open-settings-btn" :class="{ 'active': showSettings }" type="primary" @click="showSettings = true">
      <el-icon><Setting /></el-icon>
    </el-button>

    <el-dialog v-model="showSettings" title="设置">
      <el-switch
        v-model="vConsoleEnabled"
        active-text="显示 VConsole"
        @change="toggleVConsole"
      />
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElButton, ElDialog, ElSwitch, ElIcon } from 'element-plus';
import { Setting } from '@element-plus/icons-vue';

export default {
  components: {
    ElButton,
    ElDialog,
    ElSwitch,
    ElIcon,
    Setting,
  },
  setup() {
    const showSettings = ref(false);
    const vConsoleEnabled = ref(localStorage.getItem('vueBrowserRunApp_vConsoleEnabled') === 'true');
    document.querySelector('#__vconsole') && (document.querySelector('#__vconsole').style.display = vConsoleEnabled.value ? null : 'none');
    const toggleVConsole = (enabled) => {
      localStorage.setItem('vueBrowserRunApp_vConsoleEnabled', enabled);
      document.querySelector('#__vconsole') && (document.querySelector('#__vconsole').style.display = enabled ? null : 'none');
    };

    return {
      showSettings,
      vConsoleEnabled,
      toggleVConsole,
    };
  },
};
</script>

<style scoped lang="scss">
  .settings-box {
    display: inline-block;

    .open-settings-btn {
      background: transparent;
      border: none;
      padding: 5px;
      font-size: 18px;

      &.active {
        color: #409eff !important;
      }
    }
  }
</style>