<template>
  <el-container class="user-manage-list-container add-vh-100" direction="vertical">
    <Header />
    <auth-el-main class="page-main-container add-important-flex-column">
      <h3>ECharts 测试页面</h3>
      <div class="chart-container add-flex flex-center">
        <div style="width: 600px; height: 300px;" >
          <BasicLineChart :xAxisData="basicLineChartCfg.xAxisData" :seriesArr="basicLineChartCfg.seriesArr" />
        </div>
        <div style="width: 600px; height: 400px;" >
          <BaseChart :option="pieOption" />
        </div>
      </div>
    </auth-el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
  import Header from '@views/Header/index.vue';
  import BaseChart from '@components/echarts/BaseChart.vue';
  import BasicLineChart from "@components/echarts/BasicLineChart.vue";

  const basicLineChartCfg = ref({
    xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    seriesArr: [{type: 'line', data: [150, 230, 224, 218, 135, 147, 260]}, {type: 'line', data: [50, 30, 24, 18, 135, 47, 260]}]
  });
  const pieOption = ref({
    title: {
      text: 'Referer of a Website',
      subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
</script>