<template>
  <div class="grid-container">
    <div class="chart-container" id="successTps">
      <div class="chart"></div>
    </div>
    <div class="chart-container" id="failTps">
      <div class="chart"></div>
    </div>
    <div class="chart-container" id="responseTime">
      <div class="chart"></div>
    </div>
    <div class="chart-container" id="">
      <div class="chart"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core';
import { ref, watch } from 'vue'
import { GridComponent, GridComponentOption, TitleComponent,LegendComponent } from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted } from 'vue';
import { getRpsData, } from '../../api/module/user'


export default {
  setup() {
    const dataSourceRps = ref([]);
    const getRps = () => {
        getRpsData(stressId, startTime, endTime).then(
            response => {
                const { data } = response;
                if (data.code === "00000") {
                    let xAxisData: Array<string> = [];
                    let leg: Array<string> = [];
                    // time
                    for(let index = 0; index < data.data.time.length; index++) {
                      const date = new Date(data.data.time[index]);
                      // 使用 ECharts 提供的 format 对象进行时间格式化
                      const timeFormat = echarts.format.formatTime('hh:mm:ss', date);
                      xAxisData.push(timeFormat);
                    }
                    // 下面提示标题
                    leg.push(data.data.key);
                    const series = [];
                    const faileries = [];
                    for (const [url, values] of Object.entries(data.data.data)) {
                      const lineSeriesOption = {
                        name: url,
                        type: 'line',
                        data: values
                      };
                      series.push(lineSeriesOption);
                    }
                    for (const [url, values] of Object.entries(data.data.errData)) {
                      const lineSeriesOption = {
                        name: url,
                        type: 'line',
                        data: values
                      };
                      faileries.push(lineSeriesOption);
                    }
            
                    createMap('successTps', 'TPS成功趋势图', xAxisData, leg, series);
                } else {
                    // 进行加载失败时的操作
                    console.log("数据加载失败");
                }
            }
        )
    }
    const stressId = '1';
    const currentTime = new Date();
    // 减去5分钟
    currentTime.setMinutes(currentTime.getMinutes() - 1);
    // 获取减去5分钟后的时间戳（以毫秒为单位）
    const fiveMinutesAgoTimestamp = currentTime.getTime();
    const startTime = fiveMinutesAgoTimestamp
    const endTime = '1733021026000'
    const createMap = (chartDomId: string, chartTitle: string, x: Array<string>, leg: Array<string>, ser: Array<Object>) => {
      type EChartsOption = echarts.ComposeOption<GridComponentOption | LineSeriesOption>;
      echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition, TitleComponent,LegendComponent]);
      const chartDom = document.getElementById(chartDomId);
      let myChart = null;
      if (chartDom) {
        myChart = echarts.init(chartDom);
        var option: EChartsOption;
        option = {
          title: {
            text: chartTitle,
            left: 'center', // 标题水平居中
            top: 20, // 标题距离顶部的距离
          },
          xAxis: {
            type: 'category',
            data: x,
          },
          yAxis: {
            type: 'value'
          },
          legend: {
            data: leg[0], // 名称列表，对应每条线的 name 属性
            top: 'bottom', // 图例距离顶部的距离
          },
          series: ser
        };
        myChart.setOption(option);
        console.log(`Chart option set for ${chartDomId}`);
      } else {
        console.error(`未找到容器元素：${chartDomId}`);
      }
    };

    onMounted(() => {
      getRps();
      createMap('failTps', 'TPS成功趋势图', [],[],[]);
      createMap('successTps', 'TPS失败趋势图',[],[],[]);
      createMap('responseTime', '响应时间趋势图',[],[],[]);
    });
    setInterval(getRps,3000)
    return {
      createMap,
      dataSourceRps,
    };
  }
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-container {
  display: flex;
  flex-direction: column;
}

.chart {
  width: 400px;
  height: 400px;
}

.button-container {
  margin-top: 10px;
}

#request_num,
#responseTime_num {
  background: #393d49;
  color: #fafafa;
  width: 100px;
}
</style>
