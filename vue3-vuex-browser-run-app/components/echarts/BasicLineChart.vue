<template>
  <BaseChart :option="chartOption" v-bind="$attrs"></BaseChart>
</template>

<script>
import { deepAssign } from '@helpers/utils.mjs';
import BaseChart from './BaseChart.vue';

export default {
  components: {
    BaseChart
  },
  props: {
    forceOption: Object,
    option: Object,
    xAxisType: String,
    xAxisData: Array,
    yAxisType: String,
    seriesArr: Array
  },
  computed: {
    chartOption() {
      if (this.forceOption) return this.forceOption;
      const newOption = deepAssign({
        xAxis: {
          type: this.xAxisType || 'category',
          data: this.xAxisData || []
        },
        yAxis: {
          type: this.yAxisType || 'value'
        },
        series: this.seriesArr || []
      }, this.option || {});
      return newOption;
    }
  }
};
</script>