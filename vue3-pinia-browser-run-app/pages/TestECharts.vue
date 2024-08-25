<template>
  <el-container class="user-manage-list-container add-vh-100" direction="vertical">
    <Header />
    <auth-el-main class="page-main-container add-important-flex-column">
      <h3>ECharts 测试页面</h3>
      <div class="chart-container add-flex-column flex-and-height-1">
        <div class="add-flex" style=" height: 300px;">
          <BasicLineChart :xAxisData="basicLineChartCfg.xAxisData" :seriesArr="basicLineChartCfg.seriesArr" :option="basicLineChartCfg.option" />
          <BaseChart :option="pieOption" />
        </div>
        <BaseChart class="flex-1" :option="dataDransformFilterOption" />
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
    option: {
      title: {
      text: 'Basic Line Chart',
      subtext: 'Fake Data',
      left: 'center'
      }
    },
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

  const dataDransformFilterOption = ref({
    dataset: [
      {
        id: 'dataset_raw',
        source: [
          [
            "Income",
            "Life Expectancy",
            "Population",
            "Country",
            "Year"
          ]
        ]
      },
      {
        id: 'dataset_since_1950_of_germany',
        fromDatasetId: 'dataset_raw',
        transform: {
          type: 'filter',
          config: {
            and: [
              { dimension: 'Year', gte: 1950 },
              { dimension: 'Country', '=': 'Germany' }
            ]
          }
        }
      },
      {
        id: 'dataset_since_1950_of_france',
        fromDatasetId: 'dataset_raw',
        transform: {
          type: 'filter',
          config: {
            and: [
              { dimension: 'Year', gte: 1950 },
              { dimension: 'Country', '=': 'France' }
            ]
          }
        }
      }
    ],
    title: {
      text: 'Income of Germany and France since 1950'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      nameLocation: 'middle'
    },
    yAxis: {
      name: 'Income'
    },
    series: [
      {
        type: 'line',
        datasetId: 'dataset_since_1950_of_germany',
        showSymbol: false,
        encode: {
          x: 'Year',
          y: 'Income',
          itemName: 'Year',
          tooltip: ['Income']
        }
      },
      {
        type: 'line',
        datasetId: 'dataset_since_1950_of_france',
        showSymbol: false,
        encode: {
          x: 'Year',
          y: 'Income',
          itemName: 'Year',
          tooltip: ['Income']
        }
      }
    ]
  });

  fetch('assets/test-data/echarts/life-expectancy-table.json')
   .then(response => response.json())
   .then(data => dataDransformFilterOption.value.dataset[0].source = data);
</script>