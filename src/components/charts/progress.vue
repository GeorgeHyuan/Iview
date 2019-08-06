<template>
  <div ref="dom" class="charts chart-progress"></div>
</template>

<script>
import echarts from 'echarts';
import { on, off } from '@/libs/tools';
export default {
  name: 'ChartProgress',
  props: {
    ProgressData: Object,
    ProgressKey: String
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          data: this.ProgressData.legend
        },
        series: [
          {
            name: this.ProgressData.title,
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.ProgressData.yData
          }
        ]
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
    'ProgressData.yData' () {
      this.init();
    },
    'ProgressData.title' () {
      this.init();
    },
    'ProgressData.requestNum' () {
      this.init();
    },
    ProgressKey () {
      this.init();
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize);
  }
};
</script>
