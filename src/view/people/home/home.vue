<template>
  <div>
    <Row :gutter="20">
      <i-col :md="8" :lg="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 160px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon">
          <p style="font-size: 18px;line-height: 40px;">{{ infor.title }}</p>
          <count-to :end="infor.count" count-class="count-style"/>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card';
import CountTo from '_c/count-to';
import { ChartPie, ChartBar } from '_c/charts';
import Example from './example.vue';
import axios from '@/libs/api.request';
export default {
  name: 'people-home-index',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '企业数量（个）', icon: 'company', count: 0, color: '#079FFF' },
        { title: '用户数量（人）', icon: 'user', count: 0, color: '#24B6C9' },
        { title: '访问次数统计', icon: 'visit', count: 0, color: '#FF7589' },
        { title: '登录次数统计', icon: 'login', count: 0, color: '#9D66F5' }
      ],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
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
      colWidth: document.documentElement.clientWidth > 1200 ? 4 : 8
    };
  },
  methods: {
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
    }
  },
  mounted () {
    //
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.requestHomeStatistics();
    });
  }
};
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
