<template>
  <el-container class="user-manage-list-container add-vh-100" direction="vertical">
    <Header />
    <auth-el-main class="page-main-container add-important-flex-column">
      <h3>ECharts 测试页面</h3>
      <div class="chart-container add-flex-column flex-and-height-1">
        <div class="add-flex" style=" height: 300px;">
          <BasicLineChart :xAxisData="basicLineChartCfg.xAxisData" :seriesArr="basicLineChartCfg.seriesArr" :title="basicLineChartCfg.title" />
          <BaseChart :option="pieOption" />
        </div>
        <BaseChart class="flex-1" :option="stackedLineOption" />
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

  const stackedLineOption = ref({
    title: {
      text: 'Stacked Line'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        smooth: true,
        showSymbol: false,
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        smooth: true,
        showSymbol: false,
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        smooth: true,
        showSymbol: false,
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        smooth: true,
        showSymbol: false,
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        smooth: true,
        showSymbol: false,
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  });
</script>