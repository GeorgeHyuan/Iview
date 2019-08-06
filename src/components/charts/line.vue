<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts';
import { on, off } from '@/libs/tools';
export default {
  name: 'ChartLine',
  props: {
    ChartData: Object,
    LineKey: String
  },
  data () {
    return {
      dom: null
    };
  },
  methods: {
    resize () {
      this.dom.resize();
    },
    init () {
      const option = {
        title: {
          top: 10,
          text: this.ChartData.title,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#646464'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#646464'
            }
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 10,
          itemGap: 13,
          data: this.ChartData.legend,
          right: '4%',
          textStyle: {
            fontSize: 14,
            color: '#646464'
          }
        },
        grid: {
          top: 30,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#646464'
              }
            },
            data: this.ChartData.xData
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#646464'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#646464'
              }
            }
          }
        ],
        series: this.ChartData.yData
      };
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom);
        this.dom.setOption(option);
        on(window, 'resize', this.resize);
      });
    }
  },
  mounted () {
    this.init();
  },
  watch: {
    'ChartData.yData' () {
      this.init();
    },
    'ChartData.xData' () {
      this.init();
    },
    'ChartData.requestNum' () {
      this.init();
    },
    LineKey () {
      this.init();
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize);
  }
};
</script>
