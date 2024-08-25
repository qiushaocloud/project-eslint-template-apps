<template>
  <el-container class="user-manage-list-container add-vh-100" direction="vertical">
    <Header />
    <auth-el-main class="page-main-container add-important-flex-column">
      <h3>ECharts 测试页面</h3>
      <div class="chart-container">
        <div class="add-flex" style="height: 300px;">
          <BasicLineChart :xAxisData="basicLineChartCfg.xAxisData" :seriesArr="basicLineChartCfg.seriesArr" :title="basicLineChartCfg.title" />
          <BaseChart :option="pieOption" />
        </div>
        <BaseChart :option="streamOption" style="height: 300px; margin-top: 10px;" />
        <BaseChart :option="dataTransformFilterOption" style="height: 300px; margin-top: 20px;" />
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
    title: {
      text: 'Basic Line Chart',
      subtext: 'Fake Data',
      left: 'center'
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

  // 模拟大量数据
  const streamDataCount = 100; // 数据点数量
  const streamData = {
    time: [],
    resolution: [],
    framerate: [],
    bitrate: []
  };
  for (let i = 0; i < streamDataCount; i++) {
    streamData.time.push('00:' + (i < 10 ? '0' : '') + Math.floor(i / 60) + ':' + (i % 60 < 10 ? '0' : '') + (i % 60));
    streamData.resolution.push(Math.round(720 + Math.random() * 360));
    streamData.framerate.push(Math.round(30 + Math.random() * 30));
    streamData.bitrate.push(Math.round(4000 + Math.random() * 2000));
  }
  const streamOption = ref({
    title: {
      text: '优化后的直播流质量折线图'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['分辨率', '帧率', '比特率'],
      selected: {
        '分辨率': true,
        '帧率': true,
        '比特率': true
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          title: { zoom: '区域缩放', back: '区域缩放还原' },
          yAxisIndex: 'none'
        },
        magicType: {
          title: {line: '折线图', bar: '柱状图'},
          type: ['line', 'bar']
        },
        restore: {
          title: '还原'
        },
        dataView: { readOnly: false, title: '数据视图', lang: ['数据视图', '关闭', '刷新'] },
        saveAsImage: {title: '保存为图片'},
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: streamData.time
    },
    yAxis: [
      {
        type: 'value',
        name: '分辨率',
        min: 0,
        max: 1200,
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#5470C6'
          }
        },
        axisLabel: {
          formatter: '{value} p'
        }
      },
      {
        type: 'value',
        name: '帧率',
        min: 0,
        max: 100,
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#91CC75'
          }
        },
        axisLabel: {
          formatter: '{value} fps'
        }
      },
      {
        type: 'value',
        name: '比特率',
        min: 0,
        max: 6000,
        position: 'right',
        offset: 60,
        axisLine: {
          lineStyle: {
            color: '#EE6666'
          }
        },
        axisLabel: {
          formatter: '{value} kbps'
        }
      }
    ],
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: '分辨率',
        type: 'line',
        smooth: true,
        large: true,  // 启用 large 模式
        yAxisIndex: 0,
        showSymbol: false, // 隐藏标记点
        data: streamData.resolution
      },
      {
        name: '帧率',
        type: 'line',
        smooth: true,
        large: true,  // 启用 large 模式
        yAxisIndex: 1,
        showSymbol: false, // 隐藏标记点
        data: streamData.framerate
      },
      {
        name: '比特率',
        type: 'line',
        smooth: true,
        large: true,  // 启用 large 模式
        yAxisIndex: 2,
        showSymbol: false,  // 隐藏标记点
        data: streamData.bitrate
      }
    ],
    animation: false  // 关闭动画效果
  });

  const dataTransformFilterOption = ref({
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
    dataZoom: [
      {
        type: 'slider',
        start: 0,
        end: 100
      }
    ],
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
   .then(data => dataTransformFilterOption.value.dataset[0].source = data);
</script>