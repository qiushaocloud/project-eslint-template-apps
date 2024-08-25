<template>
  <div class="chart-box" ref="chartBoxRef" :style="{width: '100%', height: '100%', ...(this.style || {})}">
    <div>
      <v-chart ref="chartRef" autoresize :theme="theme" :option="option" :style="{width: '100%', height: chartHeight}" v-bind="$attrs"></v-chart>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      resizeObserver: null,
      chartHeight: '0px'
    }
  },
  props: {
    option: Object,
    theme: String,
    style: Object
  },
  mounted() {
    // 监测容器大小改变
    this.resizeObserver && this.resizeObserver.disconnect();
    this.resizeObserver = new ResizeObserver(this.updateChartSize);
    this.resizeObserver.observe(this.$refs.chartBoxRef);
    // 监听窗口大小改变
    window.addEventListener('resize', this.updateChartSize);
    this.updateChartSize();
  },
  beforeUnmount() {
    this.resizeObserver.disconnect();
    this.resizeObserver = null;
    window.removeEventListener('resize', this.updateChartSize);
  },
  methods: {
    updateChartSize() {
      this.chartHeight = `${this.$refs.chartBoxRef.clientHeight}px`;
      this.$refs.chartRef.resize();
    },
  }
};
</script>