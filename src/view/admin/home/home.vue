<style lang="less">
  @import "./home.less";
</style>

<template>
  <div>
    <Row :gutter="20">
      <i-col :lg="inforCardWidth" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 160px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :colorA="infor.colorA" :icon="infor.icon">
          <p style="font-size: 18px;line-height: 40px;">{{ infor.title }}</p>
          <count-to :end="infor.count" count-class="count-style"/>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :lg="screenWidth > 1280 ? 8 : 24" style="margin-bottom: 20px;">
        <Card class="newCard">
          <p slot="title">模块使用TOP5</p>
          <div class="modelUsageInformation">
            <Form :label-width="110">
              <FormItem v-for="(item, index) in modelInfoList" :key="item.id" :label="item.title">
                <span class="modelUsageIcon" v-if="item.icon" :style="{
          backgroundImage:'url('+require('@/assets/images/home/'+item.icon+'.png')+')',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }"></span>
                <span class="modelUsageIcon" v-else :style="{background:item.color}">{{ index + 1 }}</span>
                <p class="modelUsageProgress" :style="{
                width: ((item.value / modelInfoList[0].value) * 75) + '%',
                background: item.color
                }"></p>
                <p class="modelUsageProgressText" :style="'color:' + item.color">{{ item.value }}</p>
              </FormItem>
            </Form>
          </div>
        </Card>
      </i-col>
      <i-col :lg="screenWidth > 1280 ? 16 : 24" style="margin-bottom: 20px;">
        <Card class="newCard">
          <p slot="title">每周用户活跃量</p>
          <chart-line style="height: 300px" :ChartData="chartLineData" :LineKey="'WeekData' + chartLineData.requestNum"></chart-line>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="12">
      <i-col :lg="screenWidth > 1366 ? 8 : 12" style="margin-bottom: 20px;">
        <Card class="newCard">
          <p slot="title">CPU使用率</p>
          <p style="position: absolute;top: 12px;right: 20px;">核心数：{{ CPUData.cores }}</p>
          <chart-pie style="height: 244px;" :value="CPUData.usageRate" :pieKey="'CPUData' + CPUData.requestNum" :pieSeriesTitle="CPUData.title"></chart-pie>
        </Card>
      </i-col>
      <i-col :lg="screenWidth > 1366 ? 8 : 12" style="margin-bottom: 20px;">
        <Card class="newCard">
          <p slot="title">内存使用情况</p>
          <div class="memoryInfo">
            <Form :label-width="100">
              <FormItem label="总内存">
                <p class="progress" style="width: 75%"></p>
                <p class="progressText">{{ memory.total.toFixed(2) }}G</p>
              </FormItem>
              <FormItem label="剩余内存">
                <p class="progress" :style="'width:' + ((memory.remain / memory.total) * 75) + '%;'"></p>
                <p class="progressText">{{ memory.remain.toFixed(2) }}G</p>
              </FormItem>
              <FormItem label="已用内存">
                <p class="progress" :style="'width:' + ((memory.used / memory.total) * 75) + '%;'"></p>
                <p class="progressText">{{ memory.used.toFixed(2) }}G</p>
              </FormItem>
              <FormItem label="使用率">
                <Progress :percent="memory.usageRate" stroke-color="#079FFF" :stroke-width="22" />
              </FormItem>
            </Form>
          </div>
        </Card>
      </i-col>
      <i-col :lg="screenWidth > 1366 ? 4 : 12" style="margin-bottom: 20px;">
        <Card class="newCard">
          <p slot="title">磁盘使用率</p>
          <div class="ServerDiskMessage">
            <chart-progress style="height: 150px" :ProgressData="chartProgressData" :ProgressKey="'DiskUsageRate' + chartProgressData.requestNum"></chart-progress>
            <div class="ServerDiskMessage-text">
              <p>总大小：{{ disk.total }}GB</p>
              <p>可用大小：{{ disk.available }}GB</p>
              <p>已用大小：{{ disk.used }}GB</p>
              <p>已用百分比：{{ disk.usedPercentString }}%</p>
            </div>
          </div>
        </Card>
      </i-col>
      <i-col :lg="screenWidth > 1366 ? 4 : 12" style="margin-bottom: 20px;">
        <Card class="newCard">
          <p slot="title">服务器信息</p>
          <div class="ServerMessageBody">
            <p class="ServerMessageLabel">服务器名称:</p>
            <p class="ServerMessageText">{{ server.serverName }}</p>
            <p class="ServerMessageLabel">操作系统:</p>
            <p class="ServerMessageText">{{ server.OS }}</p>
            <p class="ServerMessageLabel">服务器IP:</p>
            <p class="ServerMessageText">{{ server.serverIP }}</p>
            <p class="ServerMessageLabel">系统架构:</p>
            <p class="ServerMessageText">{{ server.framework }}</p>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card';
import CountTo from '_c/count-to';
import { ChartPie, ChartLine, ChartProgress } from '_c/charts';
import axios from '@/libs/api.request';
export default {
  name: 'admin-home-index',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartLine,
    ChartProgress
  },
  data () {
    return {
      inforCardData: [
        { title: '企业数量（个）', icon: 'company', count: 0, color: '#079FFF', colorA: 'rgba(7,159,255,0.28)' },
        { title: '用户数量（人）', icon: 'user', count: 0, color: '#24B6C9', colorA: 'rgba(36,182,201,0.28)' },
        { title: '访问次数统计', icon: 'visit', count: 0, color: '#FF7589', colorA: 'rgba(255,117,137,0.28)' },
        { title: '登录次数统计', icon: 'login', count: 0, color: '#9D66F5', colorA: 'rgba(157,102,245,0.28)' }
      ],
      modelInfoList: [
        { id: 'modelInfo001', value: 0, title: '', color: '#FCCA2D', icon: 'first' },
        { id: 'modelInfo002', value: 0, title: '', color: '#A5A5A5', icon: 'second' },
        { id: 'modelInfo003', value: 0, title: '', color: '#F49C58', icon: 'third' },
        { id: 'modelInfo004', value: 0, title: '', color: '#079FFF', icon: null },
        { id: 'modelInfo005', value: 0, title: '', color: '#079FFF', icon: null }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      screenWidth: document.documentElement.clientWidth,
      inforCardWidth: document.documentElement.clientWidth >= 1400 ? 6 : 12,
      colWidth: document.documentElement.clientWidth > 1280 ? 4 : 8,
      // 服务器信息
      server: {
        serverName: null,
        OS: null,
        serverIP: null,
        framework: null
      },
      // 磁盘信息
      disk: {
        total: null,
        available: null,
        used: null,
        usedPercent: 0,
        usedPercentString: null
      },
      chartProgressData: {
        requestNum: 0,
        legend: [],
        title: '',
        yData: []
      },
      // CPU使用率
      CPUData: {
        title: 'CPU使用率',
        requestNum: 0,
        cores: null,
        usageRate: [
          { value: 0, name: '用户使用率' },
          { value: 0, name: '系统使用率' },
          { value: 0, name: '当前空闲率' }
        ]
      },
      // 内存信息
      memory: {
        total: 0,
        remain: 0,
        used: 0,
        usageRate: 0
      },
      chartLineData: {
        requestNum: 0,
        legend: [],
        xData: [],
        yData: []
      }
    };
  },
  methods: {
    // 请求服务器信息数据
    requestServerInformation () {
      axios.request({
        url: '/monitor/noauth/system/serverInfo',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.$data.server.serverName = res.data.data.serverName;
          this.$data.server.OS = res.data.data.operSystem;
          this.$data.server.serverIP = res.data.data.serverIp;
          this.$data.server.framework = res.data.data.systemFramework;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 请求磁盘信息数据
    requestServerDiskInformation () {
      axios.request({
        url: '/monitor/noauth/system/filesystems',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          let newDisk = {
            total: null,
            available: null,
            used: null,
            usedPercent: 0,
            usedPercentString: null
          };
          for (let i in res.data.data) {
            newDisk.total += res.data.data[i].total;
            newDisk.available += res.data.data[i].avail;
            newDisk.used += res.data.data[i].used;
          }
          this.$data.disk = {
            total: Math.round(newDisk.total),
            available: Math.round(newDisk.available),
            used: Math.round(newDisk.used),
            usedPercent: (newDisk.used / newDisk.total) * 100,
            usedPercentString: ((newDisk.used / newDisk.total) * 100).toFixed(2)
          };
          this.$data.chartProgressData.title = '磁盘使用情况';
          this.$data.chartProgressData.legend = [];
          this.$data.chartProgressData.yData = [
            { value: this.$data.disk.available, name: '未使用(G)', itemStyle: { color: 'rgba(7, 159, 255, 0.28)' } },
            { value: this.$data.disk.used, name: '已使用(G)', itemStyle: { color: '#FF6B4E' } }
          ];
          this.$data.chartProgressData.requestNum += 1;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 请求CPU使用率信息
    requestCPUUsageRate () {
      axios.request({
        url: '/monitor/noauth/system/cpu',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.$data.CPUData.cores = res.data.data.cores;
          this.$data.CPUData.usageRate[0].value = Number(res.data.data.userRate.toFixed(2));
          this.$data.CPUData.usageRate[1].value = Number(res.data.data.sysRate.toFixed(2));
          this.$data.CPUData.usageRate[2].value = Number(res.data.data.idel.toFixed(2));
          this.$data.CPUData.requestNum += 1;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 请求内存使用情况信息
    requestMemoryInformation () {
      axios.request({
        url: '/monitor/noauth/system/memory',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.$data.memory.total = res.data.data.totalMemory;
          this.$data.memory.remain = res.data.data.freeMemory;
          this.$data.memory.used = res.data.data.usedMemory;
          this.$data.memory.usageRate = Number(res.data.data.useMemoryRate.toFixed(2));
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 请求顶部四个统计数据
    requestHomeStatistics () {
      axios.request({
        url: '/core/home/getCount',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.$data.inforCardData[0].count = res.data.data.companyCount;
          this.$data.inforCardData[1].count = res.data.data.newAddUserCount;
          this.$data.inforCardData[2].count = res.data.data.systemVisitCount;
          this.$data.inforCardData[3].count = res.data.data.loginCount;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 请求模块使用情况数据
    requestModelUsageInformation () {
      axios.request({
        url: '/core/home/getModelPercent',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          for (let i in res.data.data) {
            this.$data.modelInfoList[i].title = res.data.data[i].model;
            this.$data.modelInfoList[i].value = res.data.data[i].count;
          }
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 请求每周用户量统计
    requestWeekUserReadInformation () {
      axios.request({
        url: '/core/home/getUserCountByDayWeek',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.$data.chartLineData.xData = res.data.data.dayName;
          this.$data.chartLineData.legend = ['上周', '本周'];
          this.$data.chartLineData.yData = [
            {
              name: '上周',
              type: 'line',
              smooth: true,
              lineStyle: {
                normal: {
                  width: 3
                }
              },
              areaStyle: {
                normal: {
                  color: 'rgba(73, 192, 14, 0.3)',
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(73, 192, 14)',
                  borderColor: 'rgba(137,189,2,0.27)',
                  borderWidth: 12
                }
              },
              data: res.data.data.lastWeek
            },
            {
              name: '本周',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 3
                }
              },
              areaStyle: {
                normal: {
                  color: 'rgba(7, 159, 255, 0.3)',
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(7, 159, 255)',
                  borderColor: 'rgba(0,136,212,0.2)',
                  borderWidth: 12
                }
              },
              data: res.data.data.currentWeek
            }
          ];
          this.$data.chartLineData.requestNum += 1;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    }
  },
  mounted () {
    //
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.requestHomeStatistics();
      vm.requestModelUsageInformation();
      vm.requestWeekUserReadInformation();
      vm.requestServerInformation();
      vm.requestServerDiskInformation();
      vm.requestCPUUsageRate();
      vm.requestMemoryInformation();
    });
  }
};
</script>

<style lang="less">
.count-style{
  font-size: 40px;
  line-height: 40px;
  font-weight: bold;
}
</style>
