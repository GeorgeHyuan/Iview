<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts';
import tdTheme from './theme.json';
import { on, off } from '@/libs/tools';
echarts.registerTheme('tdTheme', tdTheme);
export default {
  name: 'ChartPie',
  props: {
    value: Array,
    text: String,
    subtext: String,
    pieKey: String,
    pieSeriesTitle: String
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
      this.$nextTick(() => {
        let legend = this.value.map(_ => _.name);
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: document.documentElement.clientWidth > 1300 ? 'center' : 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: legend
          },
          series: [
            {
              name: this.pieSeriesTitle,
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.value,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        this.dom = echarts.init(this.$refs.dom, 'tdTheme');
        this.dom.setOption(option);
        on(window, 'resize', this.resize);
      });
    }
  },
  mounted () {
    this.init();
  },
  watch: {
    value (newValue, oldValue) {
      this.init();
    },
    pieKey (newValue, oldValue) {
      this.init();
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize);
  }
};
</script>
